import {forwardRef, Module} from '@nestjs/common';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Categories} from "../categories/categories.model";
import {Medicines} from "./medicines.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";
import {Orders} from "../orders/orders.model";
import {Basket} from "../orders/basket.model";
import {CategoriesService} from "../categories/categories.service";
import {CategoriesStatistics} from "../categories/categories-statistics.model";
import {StatisticsService} from "../statistics/statistics.service";
import {MedicinesStatistics} from "./medicines-statistic.model";

@Module({
  controllers: [MedicinesController],
  providers: [MedicinesService, CategoriesService,   StatisticsService],
  imports: [
    SequelizeModule.forFeature([Categories, Medicines, Orders, Basket, CategoriesStatistics, MedicinesStatistics]),
    RolesModule,
    forwardRef(() =>  AuthModule),
      FilesModule
  ],
  exports: [
      MedicinesService,
  ]
})
export class MedicinesModule {}
