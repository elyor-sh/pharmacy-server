import {Module} from "@nestjs/common";
import {AuthModule} from "./auth/auth.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from './users/users.module';
import {User} from "./users/users.model";
import {RolesModule} from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {CategoriesModule} from './categories/categories.module';
import { MedicinesModule } from './medicines/medicines.module';
import {Categories} from './categories/categories.model'
import {Medicines} from './medicines/medicines.model'
import { FilesModule } from './files/files.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, Categories, Medicines],
            autoLoadModels: true,
            ssl: process.env.SSL_DB_CONNECTION !== 'false',
            dialectOptions: {
                ssl: process.env.SSL_DB_CONNECTION === 'false' ? false : {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        }),
        AuthModule,
        UsersModule,
        RolesModule,
        CategoriesModule,
        MedicinesModule,
        FilesModule,
    ]
})
export class AppModule {

}