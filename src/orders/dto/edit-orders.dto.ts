import {CreateOrdersDto} from "./create-orders.dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsInt} from "class-validator";

export class EditOrdersDto extends CreateOrdersDto {

    @ApiProperty({example: 'Aristada', description: 'Name of medicine'})
    @IsInt({message: `id number bo'lishi kerak!`})
    readonly id: number
}