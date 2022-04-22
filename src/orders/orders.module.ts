import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Medicines} from "../medicines/medicines.model";
import {Orders} from "./order.model";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    SequelizeModule.forFeature([Medicines, Orders])
  ]
})
export class OrdersModule {}
