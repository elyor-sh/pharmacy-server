import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Medicines} from "../medicines/medicines.model";
import {Orders} from "./orders.model";
import {Basket} from "./basket.model";
import {MedicinesModule} from "../medicines/medicines.module";


@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    SequelizeModule.forFeature([ Orders, Basket, Medicines]),
      MedicinesModule
  ]
})
export class OrdersModule {}
