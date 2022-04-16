import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({example: 'categoryName', description: 'Category name'})
    @IsString({message: `Kategoriya nomi string bo'lishi kerak`})
    readonly name: string
}