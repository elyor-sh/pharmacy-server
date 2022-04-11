import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Role} from "./roles.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";

@ApiTags('Roles')
@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    @ApiOperation({summary: 'Create role'})
    @ApiResponse({status: 200, type: Role})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    createRole (@Body() dto: CreateRoleDto) {
        return this.rolesService.createRole(dto)
    }

    @ApiOperation({summary: 'Delete role'})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete('/delete/:value')
    deleteRole (@Param('value') value: string){
        return this.rolesService.deleteRole(value)
    }

    @ApiOperation({summary: 'Get all roles'})
    @ApiResponse({status: 200, type: Role})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAllRoles () {
        return this.rolesService.getAllRoles()
    }


    @ApiOperation({summary: 'Get role by value'})
    @ApiResponse({status: 200, type: Role})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('/:value')
    getRolesByValue (@Param('value') value: string) {
        return this.rolesService.getRoleByValue(value)
    }

}
