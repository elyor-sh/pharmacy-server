import { Injectable} from '@nestjs/common';
import {CreateCategoryDto} from "./dto/create-category.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Categories} from "./categories.model";
import {EditCategoryDto} from "./dto/edit.category.dto";
import {ThrowException} from "../utils/sendException";
import {paginationQuery} from "../utils/pagination";
import {normalizeResponse} from "../utils/response-util";

@Injectable()
export class CategoriesService {

    constructor(@InjectModel(Categories) private categoriesRepository: typeof Categories) {
    }

    async create(categoryDto: CreateCategoryDto) {
        const isExist = await this.categoriesRepository.findOne({where: {name: categoryDto.name}})
        if (isExist) {
            return ThrowException(4002)
        }

        const category = await this.categoriesRepository.create(categoryDto)

        return normalizeResponse<typeof category>(category, null)
    }

    async getAll(query) {

        const {page, rowCount, options} = paginationQuery( query.rowsPerPage, query.page)

        const categoriesWithLimit = await this.categoriesRepository.findAll(options)
        const categories = await this.categoriesRepository.findAll()

        return normalizeResponse<typeof categoriesWithLimit>(
            categoriesWithLimit,
            {
                page,
                rowCount,
                totalPage: categories.length
            }
        )

    }

    async getOne(id: number) {
        const category = await this.categoriesRepository.findByPk(id)
        if (!category) {
            return ThrowException(4000)
        }

        return normalizeResponse<typeof category>(category, null)
    }

    async edit(dto: EditCategoryDto) {
        const category = await this.categoriesRepository.findByPk(dto.id)
        if (!category) {
            return ThrowException(4000)
        }

        const newCategoryObj = {
            id: dto.id,
            name: dto.name
        }

        const newCategory = await this.categoriesRepository.update(newCategoryObj, {
            where: {id: dto.id},
            returning: true
        })
        return normalizeResponse<typeof newCategory[1][0]>(newCategory[1][0], null)
    }

    async delete(id: number) {
        const res = await this.categoriesRepository.destroy({where: {id: id}})
        return normalizeResponse<typeof res>(res, null)
    }
}
