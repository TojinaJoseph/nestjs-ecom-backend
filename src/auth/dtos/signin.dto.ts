import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto{
    @ApiProperty({
            description:'It should be an email',
            example:'tom12@doe.com'
        })
    @IsEmail()
    @IsNotEmpty()
    email: string;
   
    @ApiProperty({
        description:'It should be a string',
        example:'password12*'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}