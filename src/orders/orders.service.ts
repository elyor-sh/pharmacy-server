import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Orders} from "./order.model";
import {CreateOrdersDto} from "./dto/create-orders.dto";
import {EditOrdersDto} from "./dto/edit-orders.dto";

@Injectable()
export class OrdersService {

    constructor(@InjectModel(Orders) private ordersRepository: typeof Orders) {}

    async create (dto: CreateOrdersDto) {
        console.log(dto)
        try {
            return this.ordersRepository.create(dto)
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

        const ordersWithLimit = await this.ordersRepository.findAll(options)
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
