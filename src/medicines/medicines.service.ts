import { Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateMedicineDto} from "./dto/create-medicine.dto";
import {FilesService} from "../files/files.service";
import {EditMedicineDto} from "./dto/edit-medicine.dto";
import {Medicines} from "./medicines.model";
import {CategoriesService} from "../categories/categories.service";
import {GetMedicineByCategoryIdDto} from "./dto/get-medicine-by-category-id.dto";
import {Op} from "sequelize";
import {normalizeResponse} from "../utils/response-util";
import {paginationQuery} from "../utils/pagination";
import {defaultPaginationQuery} from "../utils/defaultPaginationQuery";
import {ThrowException} from "../utils/sendException";

@Injectable()
export class MedicinesService {

    constructor(
        @InjectModel(Medicines) private medicineRepository: typeof Medicines,
        private categoryService: CategoriesService,
        private filesService: FilesService
    ) {}

    async create (dto: CreateMedicineDto, image:any) {

        const isExist = await this.medicineRepository.findOne({where: {name: dto.name}})

        if(isExist){
            return ThrowException(5002)
        }

        const isExistCategory = await this.categoryService.getOne(+dto.categoryId)

        if(!isExistCategory){
            return ThrowException(4000)
        }

        const file = await this.filesService.createFile(image)

        const medicine = await this.medicineRepository.create({...dto, image: file.uri, imageId: file.id, resourceType: file.resourceType})

        return normalizeResponse<typeof medicine>(medicine, null)

    }

    async getAll(query) {

        const {page, rowCount, options} = paginationQuery(query.rowsPerPage, query.page)


        const medicinesWithLimit = await this.medicineRepository.findAll(options)
        const count = await this.getCount()

        return normalizeResponse<typeof medicinesWithLimit>(
            medicinesWithLimit,
            {
                page,
                rowCount,
                totalPage: count
            }
        )

    }

    async getCount () {
        const medicines = await this.medicineRepository.findAll()
        return medicines.length
    }

    async getOne(id: number) {
        const medicine = await this.medicineRepository.findByPk(id)
        if (!medicine) {
            return ThrowException(5000)
        }

        return normalizeResponse<typeof medicine>(medicine, null)

    }

    async update(dto: EditMedicineDto, image) {
        const medicine = await this.medicineRepository.findByPk(dto.id)

        if(!dto.id){
            return ThrowException(1010)
        }

        if (!medicine) {
            return ThrowException(5000)
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
            image: (file && file.name) ? file.name :  medicine.image,
            imageId: (file && file.id) ? file.id : medicine.imageId,
            resourceType: (file && file.resourceType) ? file.resourceType : medicine.resourceType
        }

        const newMedicine = await this.medicineRepository.update(newMedicineObj, {
            where: {id: dto.id},
            returning: true
        })

        return normalizeResponse<typeof newMedicine[1][0]>(newMedicine[1][0], null)
    }

    async delete (id: number) {

        const medicine = await this.medicineRepository.findByPk(id)

        if(!medicine){
            return ThrowException(5000)
        }

        await this.filesService.delete(medicine.imageId, medicine.resourceType)

        await this.medicineRepository.destroy({where: {id: id}})

        return normalizeResponse<typeof medicine>(medicine, null)

    }

    public async getByQuery (query: any) {

        return this.medicineRepository.findAll(query)
    }

    async getMedicineByCategoryId (params: GetMedicineByCategoryIdDto, query: any = defaultPaginationQuery) {

        const {page, rowCount, options} = paginationQuery(query.rowsPerPage, query.page)

        const medicinesWithLimit = await this.medicineRepository.findAll({
            ...options,
            where: {
                categoryId: {
                    [Op.or]: params.ids
                }
            }
        })

        const medicinesInCategory =  await this.medicineRepository.findAll({
            where: {
                categoryId: {
                    [Op.or]: params.ids
                }
            }
        })

        return normalizeResponse<typeof medicinesWithLimit>(
            medicinesWithLimit,
            {
                page,
                rowCount,
                totalPage: medicinesInCategory.length
            }
        )
    }

}
