import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Medicines} from "../medicines/medicines.model";

type Status  = 'active' | 'canceled' | 'done' | 'frozen'

interface OrdersCreationAttrs {
    text: string
    email: string
    phoneNumber: string
    fullName: string
    status: Status
}

@Table({tableName: 'orders'})
export class Orders extends Model<Orders, OrdersCreationAttrs> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'username@example.com', description: 'Email of user'})
    @Column({type: DataType.STRING, defaultValue: ''})
    email: string;

    @ApiProperty({example: 'Text', description: 'Text'})
    @Column({type: DataType.STRING, defaultValue: ''})
    text: string;

    @ApiProperty({example: '+998990001122', description: 'Phone number'})
    @Column({type: DataType.STRING, allowNull: false})
    phoneNumber: string;

    @ApiProperty({example: 'Niyazov Mirkomil Abdullayevich', description: 'Fullname of customer'})
    @Column({type: DataType.STRING, defaultValue: ''})
    fullName: string;

    @ApiProperty({example: 'active', description: 'Status of order'})
    @Column({type: DataType.STRING, defaultValue: 'active'})
    status: string;


    @ForeignKey(() => Medicines)
    @Column({type: DataType.ARRAY(DataType.INTEGER)})
    medicineId: number[]
    // @BelongsTo(() => Medicines)
    // medicines: Medicines
}