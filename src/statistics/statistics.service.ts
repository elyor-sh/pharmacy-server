import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CategoriesStatistics} from "../categories/categories-statistics.model";
import {NormalizeResponse, normalizeResponse} from "../utils/response-util";
import {MedicinesStatistics} from "../medicines/medicines-statistic.model";

@Injectable()
export class StatisticsService {

    constructor(
        @InjectModel(CategoriesStatistics) private readonly categoriesStatisticsRepo: typeof CategoriesStatistics,
        @InjectModel(MedicinesStatistics) private readonly medicinesStatisticsRepo: typeof MedicinesStatistics
    ) {}

    public async createCategoryStatistics (categoryId: number): Promise<CategoriesStatistics> {
        const statistic = await this.categoriesStatisticsRepo.findOne({where: {categoryId}})

        if(!statistic){
            return this.categoriesStatisticsRepo.create({categoryId, statisticCount: 1})
        }

        const updatedCategory = await this.categoriesStatisticsRepo.update(
            {categoryId, statisticCount: statistic.statisticCount + 1},
            {where: {categoryId}}
        )

        return updatedCategory[0][1]
    }

    public async createMedicineStatistics (medicineId: number): Promise<MedicinesStatistics> {
        const statistic = await this.medicinesStatisticsRepo.findOne({where: {medicineId}})

        if(!statistic){
            return this.medicinesStatisticsRepo.create({medicineId, statisticCount: 1})
        }

        const updatedMedicine = await this.medicinesStatisticsRepo.update(
            {medicineId, statisticCount: statistic.statisticCount + 1},
            {where: {medicineId}}
        )

        return updatedMedicine[0][1]
    }

    async getAll (): Promise<NormalizeResponse<CategoriesStatistics[]>> {
        const statistics = await this.categoriesStatisticsRepo.findAll()

        return normalizeResponse(statistics, null)
    }

}
