import {ApiProperty} from "@nestjs/swagger";

export class EditMedicineDto{

    @ApiProperty({example: 'Aristada', description: 'Name of medicine'})
    readonly id: number

    @ApiProperty({example: 'Aristada', description: 'Name of medicine'})
    readonly name: string

    @ApiProperty({example: 100000, description: 'Price of medicine'})
    readonly price: number

    @ApiProperty({example: 'Headache medicine', description: 'Description of medicine'})
    readonly description: string

    @ApiProperty({example: 10, description: 'The total amount of the medicine'})
    readonly totalCount: number

    @ApiProperty({example: true, description: 'Is there a discount for this medicine or not'})
    readonly hasDiscount: boolean

    @ApiProperty({example: 10, description: 'Price of medicine with discount'})
    readonly priceWithDiscount: number

    @ApiProperty({example: 'UZS', description: 'Currency'})
    readonly currency: string

    @ApiProperty({example: 1, description: 'Category id'})
    readonly categoryId: number

}