import {Body, Controller, Post, UseGuards, UsePipes} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CategoriesService} from "./categories.service";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {Categories} from "./categories.model";

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {}

    @ApiOperation({summary: 'Create category'})
    @ApiResponse({status: 200, type: Categories})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() categoryDto: CreateCategoryDto){
        return this.categoriesService.createCategory(categoryDto)
    }

}
