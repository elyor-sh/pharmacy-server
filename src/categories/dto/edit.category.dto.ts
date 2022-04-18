import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class EditCategoryDto {

    @ApiProperty({example: 'categoryName', description: 'Category id'})
    @IsNumber({}, {message: `Kategoriya id si number bo'lishi kerak`})
    readonly id: number

    @ApiProperty({example: 'categoryName', description: 'Category name'})
    @IsString({message: `Kategoriya nomi string bo'lishi kerak`})
    readonly name: string
}