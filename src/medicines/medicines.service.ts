import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateMedicineDto} from "./dto/create-medicine.dto";
import {FilesService} from "../files/files.service";
import {EditMedicineDto} from "./dto/edit-medicine.dto";
import {Medicines} from "./medicines.model";

@Injectable()
export class MedicinesService {

    constructor(@InjectModel(Medicines) private medicineRepository: typeof Medicines, private filesService: FilesService) {}

    async create (dto: CreateMedicineDto, image:any) {

        const isExist = await this.medicineRepository.findOne({where: {name: dto.name}})

        if(isExist){
            throw new HttpException(`Bunaqa nomli dori allaqachon bor!`, HttpStatus.BAD_REQUEST)
        }

        const isExistCategory = await this.medicineRepository.findOne({where: {id: dto.categoryId}})

        if(!isExistCategory){
           throw new HttpException(`Mavjud bo'lmagan kategoriya`, HttpStatus.BAD_REQUEST)
        }

        const file = await this.filesService.createFile(image)

        const medicine = await this.medicineRepository.create({...dto, image: file.uri, imageId: file.id, resourceType: file.resourceType})

        return {
            items: medicine,
            message: `Dori muvaffaqqiyatli qo'shildi!`
        }
    }

    async getAll(query) {

        const options = query.rowsPerPage
            ?
            {
                limit: query.rowsPerPage,
                offset: +query.page === 0 ? query.page : ((query.page - 1) * query.rowsPerPage),
                subQuery: false
            }
            :
            {
                limit: 10,
                offset: 0,
                subQuery: false
            }

        const medicinesWithLimit = await this.medicineRepository.findAll(options)
        const medicines = await this.medicineRepository.findAll()

        return {
            items: medicinesWithLimit,
            count: medicines.length
        }
    }

    async getOne(id: number) {
        const medicine = await this.medicineRepository.findByPk(id)
        if (!medicine) {
            return new HttpException('Ushbu id ga ega dori topilmadi!', HttpStatus.BAD_REQUEST)
        }

        return {
            items: medicine,
            message: `Successfully!`
        }
    }

    async update(dto: EditMedicineDto, image) {
        const medicine = await this.medicineRepository.findByPk(dto.id)

        if(!dto.id){
            return new HttpException(`id jo'natilmagan!`, HttpStatus.BAD_REQUEST)
        }

        if (!medicine) {
            return new HttpException('Ushbu id ga ega dori topilmadi!', HttpStatus.BAD_REQUEST)
        }

        let file: any

        if(image){
            await this.filesService.delete(medicine.imageId, medicine.resourceType)
            file = await this.filesService.createFile(image)
        }

        const newMedicineObj = {
            id: dto.id ? +dto.id : medicine.id,
            name: dto.name ? dto.name : medicine.name,
            price: dto.price ? +dto.price : medicine.price,
            description: dto.description ? dto.description : medicine.description,
            totalCount: dto.totalCount ? dto.totalCount : medicine.totalCount,
            hasDiscount: dto.hasDiscount ? dto.hasDiscount : medicine.hasDiscount,
            priceWithDiscount: dto.priceWithDiscount ? +dto.priceWithDiscount : medicine.priceWithDiscount,
            currency: dto.currency ? dto.currency : medicine.currency,
            categoryId: dto.categoryId ? dto.categoryId : medicine.categoryId,
            image: file.name ? file.name :  medicine.image,
            imageId: file.id ? file.id : medicine.imageId,
            resourceType: file.resourceType ? file.resourceType : medicine.resourceType
        }

        const newMedicine = await this.medicineRepository.update(newMedicineObj, {
            where: {id: dto.id},
            returning: true
        })

        return {
            items: newMedicine[1][0],
            message: `Dori muvaffaqqiyatli yangilandi!`
        }
    }

    async delete (id: number) {

        const medicine = await this.medicineRepository.findByPk(id)

        if(!medicine){
            return new HttpException(`Ushbu id ga ega dori topilmadi!`, HttpStatus.BAD_REQUEST)
        }

        await this.filesService.delete(medicine.imageId, medicine.resourceType)

        await this.medicineRepository.destroy({where: {id: id}})

        return {
            items: medicine,
            message: `Dori muvaffaqqiyatli o'chirildi!`
        }

    }

}
