import {Body, Controller, Get, Post, Query, UseGuards, UsePipes} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {ValidationPipe} from "../pipes/validation.pipe";
import {BaseGetQuery} from "../utils/types";

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: 'Create user'})
    @ApiResponse({status: 200, type: User})
    @Roles('admin')
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.usersService.createUser(userDto)
    }

    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @Roles('admin')
    @UseGuards(RolesGuard)
    @Get()
    getAllUsers (@Query() query: BaseGetQuery) {
        return this.usersService.getAllUsers(query)
    }

}
