import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: 'user@mail.ru', description: 'Email'})
    @IsString({message: 'Must be string'})
    @IsEmail({}, {message: 'Wrong email'})
    readonly email: string

    @ApiProperty({example: 'password1234', description: 'Password'})
    @IsString({message: 'Must be string'})
    @Length(6, 16, {message: 'Password length must be at least 6 and no more than 16'})
    readonly password: string

    @ApiProperty({example: 'username', description: 'Username, login'})
    @IsString({message: 'Must be string'})
    @Length(6, 16, {message: 'Username length must be at least 6 and no more than 16'})
    readonly username: string
}