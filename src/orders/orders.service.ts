import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Orders} from "./order.model";
import {CreateOrdersDto} from "./dto/create-orders.dto";
import {EditOrdersDto} from "./dto/edit-orders.dto";
import {Op} from "sequelize";
import {MedicinesService} from "../medicines/medicines.service";
import {getResponse} from "../utils/response-util";

@Injectable()
export class OrdersService {

    constructor(
        @InjectModel(Orders) private ordersRepository: typeof Orders,
        private medicineService: MedicinesService,
        ) {}

    async create (dto: CreateOrdersDto): Promise<any> {

        try {

            const medicines = await this.medicineService.getByQuery({
                    where: {
                        id: {
                            [Op.and]: dto.medicineId
                        }
                    }
                })

            if(!medicines.length){
                throw new HttpException('Kategoriyalar topilmadi!', HttpStatus.BAD_REQUEST)
            }

           let totalPrice = 0

            medicines.forEach(item => {
                totalPrice += item.price
            })

            let order = await this.ordersRepository.create({...dto, totalPrice})

            await order.$set('medicines',  medicines)

            order.medicines = medicines

            return getResponse(order, 'Success', {count: null})

        }catch (e) {
            console.log(dto)
            console.log(e)
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAll (query) {
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

        const ordersWithLimit = await this.ordersRepository.findAll( {include: {all: true}, ...options})
        const orders = await this.ordersRepository.findAll()

        return {
            items: ordersWithLimit,
            count: orders.length,
            message: 'Success'
        }
    }

    async getOne (id: number) {
        const order = await this.ordersRepository.findByPk(id)

        if(!order){
            throw new HttpException(`Ushbu id li buyurtma topilmadi!`, HttpStatus.BAD_REQUEST)
        }

        return {
            items: order,
            message: `Success`
        }
    }

    async update (dto: EditOrdersDto) {
        const order = await this.ordersRepository.findByPk(dto.id)
        if (!order) {
            return new HttpException('Kategoriya topilmadi', HttpStatus.BAD_REQUEST)
        }

        const newOrderObj = {
            ...order,
            ...dto
        }

        const newOrder = await this.ordersRepository.update(newOrderObj, {
            where: {id: dto.id},
            returning: true
        })
        return newOrder[1][0]
    }

    async delete (id: number){

        const order = await this.ordersRepository.findByPk(id)

        if(!order){
            throw new HttpException(`Ushbu id li buyurtma topilmadi!`, HttpStatus.BAD_REQUEST)
        }

        await this.ordersRepository.destroy({where: {id: id}})

        return {
            items: order,
            message: `Buyurtma muvaffaqqiyatli o'chirildi`
        }
    }
}
