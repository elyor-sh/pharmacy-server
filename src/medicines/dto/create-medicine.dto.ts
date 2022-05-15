import {ApiProperty} from "@nestjs/swagger";
import { IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateMedicineDto {

    @ApiProperty({example: 'Aristada', description: 'Name of medicine'})
    @IsString({message: 'Must be string'})
    readonly name: string

    @ApiProperty({example: 100000, description: 'Price of medicine'})
    @Type(() => Number)
    @IsNumber({}, {message: 'Must be number'})
    readonly price: number

    @ApiProperty({example: 'Headache medicine', description: 'Description of medicine'})
    @IsString({message: 'Must be string'})
    readonly description: string

    @ApiProperty({example: 10, description: 'The total amount of the medicine'})
    @Type(() => Number)
    @IsNumber({}, {message: 'Must be number'})
    readonly totalCount: number

    @ApiProperty({example: true, description: 'Is there a discount for this medicine or not'})
    @Type(() => Boolean)
    readonly hasDiscount: boolean

    @ApiProperty({example: 10, description: 'Price of medicine with discount'})
    @Type(() => Number)
    @IsNumber({}, {message: 'Must be number'})
    readonly priceWithDiscount: number

    @ApiProperty({example: 'UZS', description: 'Currency'})
    @IsString({message: 'Must be string'})
    readonly currency: string

    @ApiProperty({example: 1, description: 'Category id'})
    @Type(() => Number)
    @IsNumber({}, {message: 'Must be number'})
    readonly categoryId: number

}