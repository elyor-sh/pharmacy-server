import {forwardRef, Module} from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Categories} from "./categories.model";
import {AuthModule} from "../auth/auth.module";
import {CategoriesStatistics} from "./categories-statistics.model";
import {StatisticsService} from "../statistics/statistics.service";
import {MedicinesStatistics} from "../medicines/medicines-statistic.model";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, StatisticsService],
  imports: [
    SequelizeModule.forFeature([Categories, CategoriesStatistics, MedicinesStatistics]),
    forwardRef(() =>  AuthModule),
  ]
})
export class CategoriesModule {}
