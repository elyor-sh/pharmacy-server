import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsPhoneNumber, IsString} from "class-validator";

type Status  = 'active' | 'canceled' | 'done' | 'frozen'

export class CreateOrdersDto {
    @ApiProperty({example: 'user@example.com', description: 'User email'})
    @IsEmail({}, {message: `Haqiqiy email kiriting`})
    readonly email: string

    @ApiProperty({example: '+998990001122', description: 'User phone number'})
    @IsPhoneNumber("UZ", {message: `Xato telefon nomeri`})
    readonly phoneNumber: string

    @ApiProperty({example: 'text', description: 'Text'})
    @IsString( {message: `Maydon "text" text bo'lishi kerak`})
    readonly text: string

    @ApiProperty({example: 'Niyazov Mirkomil Abdullayevich', description: `Fullname of customer`})
    @IsString( {message: `Foydalanuvchi ismi, sharifi familiyasi text bo'lishi kerak`})
    readonly fullName: string

    @ApiProperty({example: 1, description: `id of Medicine`})
    // @IsNumber( {},{message: `Dorining id si number bo'lishi kerak`})
    readonly medicineId: number[]

    @ApiProperty({example: 'active', description: 'Status of order'})
    readonly status: Status

}