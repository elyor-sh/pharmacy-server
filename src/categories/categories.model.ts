import { Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

interface CategoriesCreationAttrs {
    name: string

}

@Table({tableName: 'categories'})
export class Categories extends Model<Categories, CategoriesCreationAttrs> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'name', description: 'Category name'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;
}