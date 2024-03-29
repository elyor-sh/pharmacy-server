import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {Basket} from "../orders/basket.model";
import {Orders} from "../orders/orders.model";

interface UserCreationAttrs {
    email: string
    password: string
    username: string
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'user@mail.ru', description: 'Email'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: 'username', description: 'Username, login'})
    @Column({type: DataType.STRING, allowNull: false})
    username: string;

    @ApiProperty({example: 'password1234', description: 'Password'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: true, description: 'Banned user or not'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'Banned for bad character', description: 'Reason of ban'})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    roleId: number

    @BelongsTo(() => Role)
    roles: Role

    @HasMany(() => Orders)
    orders: Orders;
}
