import {forwardRef, Module} from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Categories} from "./categories.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    SequelizeModule.forFeature([Categories]),
    forwardRef(() =>  AuthModule),
  ]
})
export class CategoriesModule {}
