import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {CategoriesStatistics} from "../categories/categories-statistics.model";
import {MedicinesStatistics} from "../medicines/medicines-statistic.model";

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
      SequelizeModule.forFeature([ CategoriesStatistics, MedicinesStatistics ]),
  ],
    exports: [StatisticsService]
})
export class StatisticsModule {}
