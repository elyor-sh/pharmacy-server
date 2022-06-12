import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Categories} from "../categories/categories.model";
import {Basket} from "../orders/basket.model";


interface MedicinesCreationAttrs {
    name: string
    price: number
    description: string
    image: string
    imageId: string
    resourceType: string
    totalCount: number
    hasDiscount: boolean
    priceWithDiscount: number
    currency: string
}

@Table({tableName: 'medicines'})
export class Medicines extends Model<Medicines, MedicinesCreationAttrs> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Aristada', description: 'Name of medicine'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @ApiProperty({example: 100000, description: 'Price of medicine'})
    @Column({type: DataType.FLOAT, allowNull: false})
    price: number;

    @ApiProperty({example: 'Headache medicine', description: 'Description of medicine'})
    @Column({type: DataType.STRING, defaultValue: ''})
    description: string;

    @ApiProperty({example: 'image', description: 'Any image file'})
    @Column({type: DataType.STRING, defaultValue: ''})
    image: string;

    @ApiProperty({example: 'Image', description: 'id of image'})
    @Column({type: DataType.STRING, defaultValue: ''})
    imageId: string;

    @ApiProperty({example: 'image', description: 'Type of resource'})
    @Column({type: DataType.STRING, defaultValue: ''})
    resourceType: string;

    @ApiProperty({example: 10, description: 'The total amount of the medicine'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    totalCount: number;

    @ApiProperty({example: true, description: 'Is there a discount for this medicine or not'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    hasDiscount: boolean;

    @ApiProperty({example: 10, description: 'Price of medicine with discount'})
    @Column({type: DataType.INTEGER, defaultValue: 0})
    priceWithDiscount: number;

    @ApiProperty({example: 'UZS', description: 'Currency'})
    @Column({type: DataType.STRING, defaultValue: 'UZS'})
    currency: string;

    @ApiProperty({example: 1, description: 'Category id'})
    @ForeignKey(() => Categories)
    @Column({type: DataType.INTEGER})
    categoryId: number

    @BelongsTo(() => Categories)
    category: Categories;

    @HasMany(() => Basket)
    baskets: Basket;

}