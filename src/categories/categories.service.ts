import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateCategoryDto} from "./dto/create-category.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Categories} from "./categories.model";
import {EditCategoryDto} from "./dto/edit.category.dto";

@Injectable()
export class CategoriesService {

    constructor(@InjectModel(Categories) private categoriesRepository: typeof Categories) {}

    async create(categoryDto: CreateCategoryDto) {
        const isExist = await this.categoriesRepository.findOne({where: {name: categoryDto.name}})
        if(isExist){
            return new HttpException('Bunaqa nomli kategoriya allaqachon bor', HttpStatus.BAD_REQUEST)
        }

        const category = await this.categoriesRepository.create(categoryDto)
        return category
    }

    async getAll () {
        const categories = await this.categoriesRepository.findAll()
        return categories
    }

    async getOne (id: number) {
        const category = await this.categoriesRepository.findByPk(id)
        if(!category){
            return new HttpException('Kategoriya topilmadi', HttpStatus.BAD_REQUEST)
        }

        return category
    }

    async edit (dto: EditCategoryDto) {
        const category = await this.categoriesRepository.findByPk(dto.id)
        if(!category){
            return new HttpException('Kategoriya topilmadi', HttpStatus.BAD_REQUEST)
        }

        const newCategoryObj = {
            id: dto.id,
            name: dto.name
        }

       const newCategory = await this.categoriesRepository.update(newCategoryObj, {where: {id: dto.id}, returning: true})
        return newCategory[1][0]
    }

    async delete (id: number) {
        const deletedCategory = await this.categoriesRepository.destroy({where: {id: id}})
        return deletedCategory
    }
}
