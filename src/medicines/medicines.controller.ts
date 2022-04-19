import {
    Body,
    Controller,
    Delete, Get,
    Param,
    Post, Put, Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes
} from '@nestjs/common';
import {MedicinesService} from "./medicines.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {ValidationPipe} from "../pipes/validation.pipe";
import {Medicines} from "./medicines.model";
import {CreateMedicineDto} from "./dto/create-medicine.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {EditMedicineDto} from "./dto/edit-medicine.dto";

@Controller('medicines')
export class MedicinesController {

    constructor(private medicinesService: MedicinesService) {}

    @ApiOperation({summary: 'Create medicine'})
    @ApiResponse({status: 200, type: Medicines})
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('image'))
    @Post()
    create(@Body() dto: CreateMedicineDto, @UploadedFile() image){
        return this.medicinesService.create(dto, image)
    }

    @ApiOperation({summary: 'Create medicine'})
    @ApiResponse({status: 200, type: Medicines})
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('image'))
    @Put('/edit')
    update(@Body() dto: EditMedicineDto, @UploadedFile() image){
        return this.medicinesService.update(dto, image)
    }

    @ApiOperation({summary: 'Create medicine'})
    @ApiResponse({status: 200, type: Medicines})
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @Get()
    getAll(@Query() query){
        return this.medicinesService.getAll(query)
    }

    @ApiOperation({summary: 'Create medicine'})
    @ApiResponse({status: 200, type: Medicines})
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @Get('/:id')
    getOne(@Param('id') id: number){
        return this.medicinesService.getOne(id)
    }

    @ApiResponse({status: 200, type: Medicines})
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @Delete('/delete/:id')
    delete(@Param('id') id: number){
        return this.medicinesService.delete(id)
    }

}
