import {forwardRef, Module} from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Categories} from "./categories.model";
import {AuthModule} from "../auth/auth.module";
import {CategoriesStatistics} from "./categories-statistics.model";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    SequelizeModule.forFeature([Categories, CategoriesStatistics]),
    forwardRef(() =>  AuthModule),
  ]
})
export class CategoriesModule {}
