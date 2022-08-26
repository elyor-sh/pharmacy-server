import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Categories} from "./categories.model";


interface CategoryStatisticsCreationAttrs {
    categoryId: number
    statisticCount: number
}

@Table({tableName: 'categories_statistics'})
export class CategoriesStatistics extends Model<CategoriesStatistics, CategoryStatisticsCreationAttrs> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 1, description: 'Count of statistics'})
    @Column({type: DataType.INTEGER})
    statisticCount: number;

    @ApiProperty({example: 1, description: 'Category id'})
    @ForeignKey(() => Categories)
    @Column({type: DataType.INTEGER})
    categoryId: number;

    @BelongsTo(() => Categories)
    category: Categories;
}