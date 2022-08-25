import {CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ThrowException} from "../utils/sendException";


const ignoreRoutes = [
  '/auth/registration',
  '/auth/login'
]

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        try {
            const req = context.switchToHttp().getRequest()

            const isPublic = this.reflector.get<boolean>(
                'isPublic',
                context.getHandler()
            );

            if (isPublic) {
                return true;
            }

            const authHeader = req.headers.authorization

            if(!authHeader){
                return ThrowException(2003)
            }

            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if(bearer !== 'Bearer' || !token){
                return ThrowException(2003)
            }

            console.log(token)

            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET_JWT_KEY || 'SECRET_KEY'
            })
            req.user = user
            return true
            
        }catch (e) {
            console.log(e)
            return ThrowException(2003)
        }
    }
}