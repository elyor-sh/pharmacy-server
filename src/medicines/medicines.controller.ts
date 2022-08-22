import {
    Body,
    Controller,
    Delete, Get, HttpException, HttpStatus,
    Param,
    Post, Put, Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes
} from '@nestjs/common';
import {MedicinesService} from "./medicines.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {ValidationPipe} from "../pipes/validation.pipe";
import {Medicines} from "./medicines.model";
import {CreateMedicineDto} from "./dto/create-medicine.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {EditMedicineDto} from "./dto/edit-medicine.dto";
import {Public} from "../auth/public.decorator";

@ApiTags('Medicines')
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
        try {
            return this.medicinesService.create(dto, image)

        }catch (e) {
           throw new HttpException(e, e.status || HttpStatus.BAD_REQUEST)
        }
    }

    @ApiOperation({summary: 'Edit medicine'})
    @ApiResponse({status: 200, type: Medicines})
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('image'))
    @Put('/edit')
    update(@Body() dto: EditMedicineDto, @UploadedFile() image){
        return this.medicinesService.update(dto, image)
    }

    @ApiOperation({summary: 'Get all medicines'})
    @ApiResponse({status: 200, type: Medicines})
    // @Roles('admin', 'manager')
    // @UseGuards(RolesGuard)
    @Public()
    @Get()
    getAll(@Query() query){
        return this.medicinesService.getAll(query)
    }

    @ApiOperation({summary: 'Get one medicine'})
    @ApiResponse({status: 200, type: Medicines})
    // @Roles('admin', 'manager')
    // @UseGuards(RolesGuard)
    @Public()
    @Get('/:id')
    getOne(@Param('id') id: number){
        return this.medicinesService.getOne(id)
    }

    @ApiOperation({summary: 'Delete medicine'})
    @ApiResponse({status: 200, type: Medicines})
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @Delete('/delete/:id')
    delete(@Param('id') id: number){
        return this.medicinesService.delete(id)
    }

}
