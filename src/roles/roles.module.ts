import {forwardRef, Module} from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {AuthModule} from "../auth/auth.module";
import {Orders} from "../orders/orders.model";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, Orders]),
    forwardRef(() =>  AuthModule),
  ],
  exports: [RolesService]
})
export class RolesModule {}
