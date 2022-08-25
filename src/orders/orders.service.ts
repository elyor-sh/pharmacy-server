import { HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {Orders} from "./orders.model";
import {CreateOrdersDto} from "./dto/create-orders.dto";
import {EditOrdersDto} from "./dto/edit-orders.dto";
import {MedicinesService} from "../medicines/medicines.service";
import {Basket} from "./basket.model";
import {Medicines} from "../medicines/medicines.model";
import {normalizeResponse} from "../utils/response-util";
import {paginationQuery} from "../utils/pagination";
import {ThrowException} from "../utils/sendException";

@Injectable()
export class OrdersService {

    constructor(
        @InjectModel(Orders) private ordersRepository: typeof Orders,
        @InjectModel(Basket) private basketRepository: typeof Basket,
        private medicineService: MedicinesService,
    ) {
    }

    async create(dto: CreateOrdersDto[], userId: number): Promise<any> {

        try {

            const medicineIds = dto.map(item => item.medicineId)

            const medicines = await this.medicineService.getByQuery({
                where: {
                    id: {
                        [Op.and]: medicineIds
                    }
                }
            })

            if (!medicines) {
                return ThrowException(5001)
            }

            await this.updateMedicinesCount(medicines, dto)

            let totalPrice = this.getTotalPrice(medicines, dto)

            const order = await this.ordersRepository.create({
                userId,
                status: 'active',
                totalPrice
            })

            let basketsArray = this.getBasketsArrayAndCount(medicines, dto, order)

            const baskets = await this.basketRepository.bulkCreate(basketsArray, {returning: true})

            baskets.forEach(item => {
                totalPrice += item.price
            })

            await order.$set('baskets', baskets)

            order.baskets = baskets

            const response = {
                order, baskets
            }

            return normalizeResponse<typeof response>(response, null)

        } catch (e) {
            console.log('error', e)
        }
    }

    async getAll(query) {

        const {options, page, rowCount} = paginationQuery(query.rowsPerPage, query.page)

        const ordersWithLimit = await this.ordersRepository.findAll({include: {all: true}, ...options})
        const orders = await this.ordersRepository.findAll()

        return normalizeResponse<typeof ordersWithLimit>(
            ordersWithLimit,
            {
                page,
                totalPage: orders.length,
                rowCount: rowCount
            }
        )
    }

    async getOne(id: number) {
        const order = await this.ordersRepository.findByPk(id)

        if (!order) {
            return ThrowException(3000)
        }

        return normalizeResponse<typeof order>(order, null)
    }

    async update(dto: EditOrdersDto) {

        const order = await this.ordersRepository.findByPk(dto.id)
        if (!order) {
            return ThrowException(3000)
        }

        if (!dto.baskets) {
            return order
        }

        const medicineIds = []

        let basketIds = []

        dto.baskets.forEach(basket => {
            basketIds.push(basket.id)
            medicineIds.push(basket.medicineId)
        })

        const medicines = await this.medicineService.getByQuery({
            where: {
                id: {
                    [Op.and]: medicineIds
                }
            }
        })

        if (!medicines) {
            return ThrowException(5001)
        }

        await this.getMultipleBaskets(basketIds)

        const baskets = this.getUpdatedBasketsList(medicines, dto, order)

        await order.$set('baskets', baskets)

        return normalizeResponse<typeof order>(order, null)
    }

    async delete(id: number) {

        const order = await this.ordersRepository.findByPk(id)

        if (!order) {
            return ThrowException(3000)
        }

        await this.ordersRepository.destroy({where: {id: id}})

        await this.basketRepository.destroy({where: {orderId: id}})

        return normalizeResponse<typeof order>(order, null)
    }

    private async getMultipleBaskets(ids: number[]) {
        try {

            const baskets = await this.basketRepository.findAll({
                where: {
                    id: {
                        [Op.and]: ids
                    }
                }
            })

            if (!baskets) {
                return ThrowException(6001)
            }

            return baskets

        } catch (e) {
            throw new Error(e)
        }
    }

    private async updateMedicinesCount(medicines: Medicines[], dto: CreateOrdersDto[]) {
        try {

            let error = false

            medicines.forEach(item => {
                dto.forEach(d => {

                    if (item.totalCount - d.count < 0) {
                        error = true
                        return ThrowException(3002)
                    }
                })
            })

            if(error){
                return ThrowException(3002)
            }

            medicines.forEach(item => {
                dto.forEach(d => {

                    (async () => {
                        await this.medicineService.update({id: item.id, totalCount: item.totalCount - d.count}, null)
                    })();
                })
            })


        } catch (e) {
            throw new Error(e)
        }
    }

    private getTotalPrice(medicines: Medicines[], dto: CreateOrdersDto[]): number {
        let totalPrice = 0

        medicines.forEach((medicine) => {
            dto.forEach(item => {
                if (item.medicineId === medicine.id) {
                    totalPrice = totalPrice + (medicine.price * item.count)
                }
            })
        })

        return totalPrice
    }

    private getBasketsArrayAndCount(medicines: Medicines[], dto: CreateOrdersDto[], order: Orders) {

        let basketsArray: any[] = []

        medicines.forEach((medicine) => {
            dto.forEach(item => {
                if (item.medicineId === medicine.id) {

                    const obj = {
                        medicineId: item.medicineId,
                        count: item.count,
                        price: medicine.price * item.count,
                        orderId: order.id
                    }

                    basketsArray.push(obj)
                }
            })
        })

        return basketsArray

    }

    private getUpdatedBasketsList(medicines: Medicines[], dto: EditOrdersDto, order: Orders) {

        let basketsArray: any[] = []

        medicines.forEach((medicine) => {
            dto?.baskets.forEach(item => {
                if (item.medicineId === medicine.id) {

                    const obj = {
                        medicineId: item.medicineId,
                        count: item.count,
                        price: medicine.price * item.count,
                        orderId: order.id
                    }

                    basketsArray.push(obj)
                }
            })
        })

        return basketsArray

    }

}
