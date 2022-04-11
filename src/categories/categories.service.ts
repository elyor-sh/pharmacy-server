import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateCategoryDto} from "./dto/create-category.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Categories} from "./categories.model";

@Injectable()
export class CategoriesService {

    constructor(@InjectModel(Categories) private categoriesRepository: typeof Categories) {}

    async createCategory(categoryDto: CreateCategoryDto) {
        const isExist = await this.categoriesRepository.findOne({where: {name: categoryDto.name}})
        if(isExist){
            return new HttpException('A category with this name already exists', HttpStatus.BAD_REQUEST)
        }

        const category = await this.categoriesRepository.create(categoryDto)
        return category
    }
}
