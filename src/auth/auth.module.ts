import {forwardRef, Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        SequelizeModule.forFeature([User]),
       forwardRef(() =>  UsersModule),
        JwtModule.register({
           secret: process.env.JWT_SECRET_KEY || 'SECRET_KEY',
            signOptions: {
               expiresIn: '12h'
            }
        })
    ],
    exports: [
        AuthService,
        JwtModule
    ]
})

export class AuthModule {

}

