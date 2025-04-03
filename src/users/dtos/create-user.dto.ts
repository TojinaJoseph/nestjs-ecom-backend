import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(96)
    firstName: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(96)
    lastName?: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(96)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    password: string;
}