import {ApiProperty} from "@nestjs/swagger";

export class GetMedicineByCategoryIdDto {

    @ApiProperty({example: [1, 2, 3], description: 'Ids of categories'})
    readonly ids: number[]
}