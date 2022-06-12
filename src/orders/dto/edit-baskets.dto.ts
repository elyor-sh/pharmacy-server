import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class EditBasketsDto {

    @ApiProperty({example: 1, description: `id of basket`})
    @IsNumber( {},{message: `Savatchaning id si number bo'lishi kerak`})
    readonly id: number

    @ApiProperty({example: 1, description: `id of Medicine`})
    @IsNumber( {},{message: `Dorining id si number bo'lishi kerak`})
    readonly medicineId: number

    @ApiProperty({example: 1, description: `id of order`})
    @IsNumber( {},{message: `Zakaz id si number bo'lishi kerak`})
    readonly orderId: number

    @ApiProperty({example: 1, description: `Count of Medicine`})
    @IsNumber( {},{message: `Dorining soni number bo'lishi kerak`})
    readonly count: number
}