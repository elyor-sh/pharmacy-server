import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Medicines} from "./medicines.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateMedicineDto} from "./dto/create-medicine.dto";
import {FilesService} from "../files/files.service";

@Injectable()
export class MedicinesService {

    constructor(@InjectModel(Medicines) private medicineRepository: typeof Medicines, private filesService: FilesService) {}

    async create (dto: CreateMedicineDto, image:any) {

        const isExist = await this.medicineRepository.findOne({where: {name: dto.name}})

        if(isExist){
            return new HttpException(`Bunaqa nomli dori allaqachon bor!`, HttpStatus.BAD_REQUEST)
        }

        const fileName = await this.filesService.createFile(image)

        const medicine = await this.medicineRepository.create({...dto, image: fileName})

        return medicine
    }

    async delete () {

    }

}
