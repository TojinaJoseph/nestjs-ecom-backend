import { IsNotEmpty, IsNumber, IsOptional, isString, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateProductDto{

    @IsString()
    @IsNotEmpty()
    @MaxLength(96)
    @MinLength(3)
    title:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(216)
    @MinLength(10)
    description:string;

    @IsNumber()
    @IsNotEmpty()
    price:number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(96)
    @MinLength(3)
    category:string;

    @IsNumber()
    @IsOptional()
    rating?:number;

    @IsString()
    @IsOptional()
    featuredImageUrl?:string;

    @IsString()
    @IsOptional()
    @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    slug?:string;

}