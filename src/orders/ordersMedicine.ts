import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Medicines} from "../medicines/medicines.model";
import {Orders} from "./order.model";


@Table({tableName: 'orders_medicine'})
export class OrdersMedicine extends Model<OrdersMedicine> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Medicines)
    @ApiProperty({example: 1, description: 'Id of medicine'})
    @Column({type: DataType.INTEGER})
    medicineId: number;

    @ForeignKey(() => Orders)
    @ApiProperty({example: 1, description: 'Id of order'})
    @Column({type: DataType.INTEGER})
    orderId: number;

}