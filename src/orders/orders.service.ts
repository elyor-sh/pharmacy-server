import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Orders} from "./orders.model";
import {CreateOrdersDto} from "./dto/create-orders.dto";
import {EditOrdersDto} from "./dto/edit-orders.dto";
import {Op, or} from "sequelize";
import {MedicinesService} from "../medicines/medicines.service";
import {getResponse} from "../utils/response-util";
import {Basket} from "./basket.model";
import {Medicines} from "../medicines/medicines.model";

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
                throw new HttpException(`Dorilar topilmadi`, HttpStatus.BAD_REQUEST)
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

            return getResponse({order, baskets}, 'success', null)

        } catch (e) {
            console.log('error', e)
            throw new Error(e)
        }
    }

    async getAll(query) {
        const options = query.rowsPerPage
            ?
            {
                limit: query.rowsPerPage,
                offset: +query.page === 0 ? query.page : ((query.page - 1) * query.rowsPerPage),
                subQuery: false
            }
            :
            {
                limit: 10,
                offset: 0,
                subQuery: false
            }

        const ordersWithLimit = await this.ordersRepository.findAll({include: {all: true}, ...options})
        const orders = await this.ordersRepository.findAll()

        return {
            items: ordersWithLimit,
            count: orders.length,
            message: 'Success'
        }
    }

    async getOne(id: number) {
        const order = await this.ordersRepository.findByPk(id)

        if (!order) {
            throw new HttpException(`Ushbu id li buyurtma topilmadi!`, HttpStatus.BAD_REQUEST)
        }

        return {
            items: order,
            message: `Success`
        }
    }

    async update(dto: EditOrdersDto) {

        const order = await this.ordersRepository.findByPk(dto.id)
        if (!order) {
            return new HttpException('Kategoriya topilmadi', HttpStatus.BAD_REQUEST)
        }

        if(!dto.baskets){
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
            throw new HttpException(`Dorilar topilmadi`, HttpStatus.BAD_REQUEST)
        }

        await this.getMultipleBaskets(basketIds)

        const baskets = this.getUpdatedBasketsList(medicines, dto, order)

        await order.$set('baskets', baskets)

        return order
    }

    async delete(id: number) {

        const order = await this.ordersRepository.findByPk(id)

        if (!order) {
            throw new HttpException(`Ushbu id li buyurtma topilmadi!`, HttpStatus.BAD_REQUEST)
        }

        await this.ordersRepository.destroy({where: {id: id}})

        await this.basketRepository.destroy({where: {orderId: id}})

        return {
            items: order,
            message: `Buyurtma muvaffaqqiyatli o'chirildi`
        }
    }

    private async getMultipleBaskets (ids: number[]) {
        try {

            const baskets  = await this.basketRepository.findAll({
                where: {
                    id: {
                        [Op.and]: ids
                    }
                }
            })

            if(!baskets){
                throw new HttpException(`Hamma savatchalar ham topilmadi!`, HttpStatus.BAD_REQUEST)
            }

            return baskets

        }catch (e) {
            throw new Error(e)
        }
    }

    private async updateMedicinesCount (medicines: Medicines[], dto: CreateOrdersDto[]) {
        try {

            medicines.forEach(item => {
               dto.forEach(d => {

                   if(item.totalCount - d.count < 1){
                       throw new HttpException(`Dostavkalardagi ko'rsatilgan dorilar soni tovar sonidan ko'p`, HttpStatus.BAD_REQUEST)
                   };

                   (async () => {
                       await this.medicineService.update({id: item.id, totalCount: item.totalCount - d.count}, null)
                   })();
               })
            })

        }catch (e) {
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
