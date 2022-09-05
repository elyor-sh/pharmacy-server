import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Medicines} from "./medicines.model";


interface MedicinesCreationAttrs {
    medicineId: number
    statisticCount: number
}

@Table({tableName: 'medicines_statistics'})
export class MedicinesStatistics extends Model<MedicinesStatistics, MedicinesCreationAttrs> {
    @ApiProperty({example: 1, description: 'Unique identifier'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 1, description: 'Count of statistics'})
    @Column({type: DataType.INTEGER})
    statisticCount: number;

    @ApiProperty({example: 1, description: 'Medicine id'})
    @ForeignKey(() => Medicines)
    @Column({type: DataType.INTEGER})
    medicineId: number;

    @BelongsTo(() => Medicines)
    medicine: Medicines;
}