import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Medicines} from "../medicines/medicines.model";
import {Basket} from "./basket.model";
import {User} from "../users/users.model";

type Status  = 'active' | 'canceled' | 'done' | 'frozen'

interface OrdersCreationAttrs {
    userId: number
    status: Status
    totalPrice: number
}

@Table({tableName: 'orders'})
export class Orders extends Model<Orders, OrdersCreationAttrs> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @ApiProperty({example: 1, description: 'Id of user'})
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    author: User

    @ApiProperty({example: 'active', description: 'Status of order'})
    @Column({type: DataType.STRING, defaultValue: 'active'})
    status: string;

    @ApiProperty({example: 120000, description: 'Total price of order'})
    @Column({type: DataType.FLOAT, defaultValue: 0})
    totalPrice: number;

    @HasMany(() => Basket)
    baskets: Basket[]
}