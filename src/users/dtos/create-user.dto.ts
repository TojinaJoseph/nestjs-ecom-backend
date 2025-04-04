import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty({
        description:'It should be a string',
        example:'Tom'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(96)
    firstName: string;

    @ApiProperty({
        description:'It should be a string',
        example:'Doe'
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(96)
    lastName?: string;

    @ApiProperty({
        description:'It should be a string',
        example:'tom@doe.com'
    })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(96)
    email: string;

    @ApiProperty({
        description:'It should be a string',
        example:'Password12*'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(96)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    password: string;
}