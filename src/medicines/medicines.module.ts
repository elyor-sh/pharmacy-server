import {forwardRef, Module} from '@nestjs/common';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Categories} from "../categories/categories.model";
import {Medicines} from "./medicines.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";
import {Orders} from "../orders/order.model";
import {OrdersMedicine} from "../orders/ordersMedicine";

@Module({
  controllers: [MedicinesController],
  providers: [MedicinesService],
  imports: [
    SequelizeModule.forFeature([Categories, Medicines, Orders, OrdersMedicine]),
    RolesModule,
    forwardRef(() =>  AuthModule),
      FilesModule
  ],
  exports: [
      MedicinesService,
  ]
})
export class MedicinesModule {}
