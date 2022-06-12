import {ApiProperty} from "@nestjs/swagger";
import {IsInt} from "class-validator";
import {EditBasketsDto} from "./edit-baskets.dto";

export class EditOrdersDto {

    @ApiProperty({example: 'Aristada', description: 'Name of medicine'})
    @IsInt({message: `id number bo'lishi kerak!`})
    readonly id: number

    baskets?: EditBasketsDto[]
}