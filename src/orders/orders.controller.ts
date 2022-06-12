import {Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {OrdersService} from "./orders.service";
import {ValidationPipe} from "../pipes/validation.pipe";
import {Orders} from "./orders.model";
import {CreateOrdersDto} from "./dto/create-orders.dto";
import {EditOrdersDto} from "./dto/edit-orders.dto";
import {UserDecorator} from "../users/users.decorator";
import {User} from "../users/users.model";

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {

    constructor(private ordersService: OrdersService) {}

    @ApiOperation({summary: 'Create order'})
    @ApiResponse({status: 200, type: Orders})
    @UsePipes(ValidationPipe)
    @Post()
    create(@UserDecorator() user: User, @Body() dto: CreateOrdersDto[]){

        return this.ordersService.create(dto, user.id)
    }

    @ApiOperation({summary: 'Get all orders'})
    @ApiResponse({status: 200, type: Orders})
    @Get()
    getAll (@Query() query) {
        return this.ordersService.getAll(query)
    }

    @ApiOperation({summary: 'Get one order'})
    @ApiResponse({status: 200, type: Orders})
    @Get('/:id')
    getOne (@Param('id') id: number) {
        return this.ordersService.getOne(id)
    }

    @ApiOperation({summary: 'Edit order'})
    @ApiResponse({status: 200, type: Orders})
    @UsePipes(ValidationPipe)
    @Put('/edit')
    update(@Body() dto: EditOrdersDto){
        return this.ordersService.update(dto)
    }

    @ApiOperation({summary: 'Edit order'})
    @ApiResponse({status: 200, type: Orders})
    @Delete('/delete/:id')
    delete(@Param('id') id: number){
        return this.ordersService.delete(id)
    }

}
