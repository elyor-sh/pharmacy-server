import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";


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

            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            console.log(bearer, token)
            if(bearer !== 'Bearer' || !token){
                throw new UnauthorizedException({message: 'User is not authorized'})
            }

            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET_JWT_KEY || 'SECRET_KEY'
            })
            req.user = user
            return true
            
        }catch (e) {
            console.log(e)
            throw new UnauthorizedException({message: 'User is not authorized'})
        }
    }
}