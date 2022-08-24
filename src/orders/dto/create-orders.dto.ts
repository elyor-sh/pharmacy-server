import {ApiProperty} from "@nestjs/swagger";
import { IsNumber} from "class-validator";

type Status  = 'active' | 'canceled' | 'done' | 'frozen'

export class CreateOrdersDto {

    @ApiProperty({example: 1, description: `id of Medicine`})
    @IsNumber( {},{message: `Dorining id si number bo'lishi kerak`})
    readonly medicineId: number

    @ApiProperty({example: 'active', description: 'Status of order'})
    @IsNumber( {},{message: `Dorining soni number bo'lishi kerak`})
    readonly count: number

}