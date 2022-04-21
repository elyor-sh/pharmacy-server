import {Body, Controller, Post, UsePipes} from "@nestjs/common";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {ValidationPipe} from "../pipes/validation.pipe";
import {Public} from "./public.decorator";

@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Registration'})
    @Public()
    @UsePipes(ValidationPipe)
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto)
    }

    @ApiOperation({summary: 'Login'})
    @Public()
    @UsePipes(ValidationPipe)
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto)
    }
}