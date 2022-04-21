import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        try {
            const requiredRoles =this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])

            if(!requiredRoles){
                return true
            }
            const req = context.switchToHttp().getRequest()
            const authHeader = req.headers.authorization

            if(!authHeader){
                throw new UnauthorizedException({message: 'Foydalanuvchi saytda login qilmagan'})
            }

            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            //console.log(authHeader)

            if(bearer !== 'Bearer' || !token){
                throw new UnauthorizedException({message: 'Foydalanuvchi saytda login qilmagan'})
            }

            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET_JWT_KEY || 'SECRET_KEY'
            })

            req.user = user

            const hasRight =  requiredRoles.includes(user.roles.value)

            if(!hasRight){
                throw new UnauthorizedException({message: `Yetarlicha huquq yo'q`})
            }

            return true

        }catch (e) {
            throw new UnauthorizedException({message: `Yetarlicha huquq yo'q`})
        }
    }
}