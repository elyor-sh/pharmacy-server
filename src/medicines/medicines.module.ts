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

@Module({
  controllers: [MedicinesController],
  providers: [MedicinesService],
  imports: [
    SequelizeModule.forFeature([Categories, Medicines, Orders]),
    RolesModule,
    forwardRef(() =>  AuthModule),
      FilesModule
  ]
})
export class MedicinesModule {}
