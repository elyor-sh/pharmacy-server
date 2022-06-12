import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Medicines} from "../medicines/medicines.model";
import {Orders} from "./orders.model";

interface BasketModelAttrs {
    medicineId: number
    count: number
    price: number
    orderId: number
}


@Table({tableName: 'basket_medicine'})
export class Basket extends Model<Basket, BasketModelAttrs> {

    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Medicines)
    @ApiProperty({example: 1, description: 'Id of medicine'})
    @Column({type: DataType.INTEGER})
    medicineId: number;

    @BelongsTo(() => Medicines)
    medicine: Medicines

    @ApiProperty({example: 1, description: 'Count of medicine'})
    @Column({type: DataType.INTEGER})
    count: number;

    @ApiProperty({example: 1, description: 'Price of basket'})
    @Column({type: DataType.FLOAT, allowNull: false})
    price: number;

    @ForeignKey(() => Orders)
    @Column({type: DataType.INTEGER})
    orderId: number;

    @BelongsTo(() => Orders)
    order: Orders

}