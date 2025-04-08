import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto{
    @ApiProperty({
            description:'It should be an email',
            example:'tom123@gmail.com'
        })
    @IsEmail()
    @IsNotEmpty()
    email: string;
   
    @ApiProperty({
        description:'It should be a string',
        example:'password123*'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}