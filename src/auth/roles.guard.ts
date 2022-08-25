import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";
import {ErrorMessages} from "../utils/error-messages";

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
                throw new UnauthorizedException({response: {message: ErrorMessages[2003], code: 2003}})
            }

            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            //console.log(authHeader)

            if(bearer !== 'Bearer' || !token){
                throw new UnauthorizedException({response: {message: ErrorMessages[2003], code: 2003}})
            }

            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET_JWT_KEY || 'SECRET_KEY'
            })

            req.user = user

            const hasRight =  requiredRoles.includes(user.roles.value)

            if(!hasRight){
                throw new HttpException({response: {message: ErrorMessages[2004], code: 2004}}, HttpStatus.FORBIDDEN)
            }

            return true

        }catch (e) {
            throw new HttpException({response: {message: ErrorMessages[2004], code: 2004}}, HttpStatus.FORBIDDEN)
        }
    }
}