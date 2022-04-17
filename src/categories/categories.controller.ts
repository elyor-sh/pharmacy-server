import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CategoriesService} from "./categories.service";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {Categories} from "./categories.model";
import {EditCategoryDto} from "./dto/edit.category.dto";

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {}

    @ApiOperation({summary: 'Create category'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, type: Categories})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() categoryDto: CreateCategoryDto){
        return this.categoriesService.create(categoryDto)
    }

    @ApiOperation({summary: 'Get all categories'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, type: Categories})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAll(@Query() query){
        return this.categoriesService.getAll(query)
    }

    @ApiOperation({summary: 'Get one category'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, type: Categories})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('/:id')
    getOne(@Param('id') id: number){
        return this.categoriesService.getOne(id)
    }

    @ApiOperation({summary: 'Edit category'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, type: Categories})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Put('/edit')
    edit(@Body() dto: EditCategoryDto){
        return this.categoriesService.edit(dto)
    }

    @ApiOperation({summary: 'Delete category'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, type: Categories})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete('/delete/:id')
    delete(@Param('id') id: number){
        return this.categoriesService.delete(id)
    }

}
