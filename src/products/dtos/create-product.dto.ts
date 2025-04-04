import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateProductDto{
    @ApiProperty({
        description:'title should be a string',
        example:'Nike Air Max 2024'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(96)
    @MinLength(3)
    title:string;

    @ApiProperty({
        description:'description should be a string',
        example:'Lightweight running shoes with enhanced cushioning.'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(216)
    @MinLength(10)
    description:string;

    @ApiProperty({
        description:'price should be a number',
        example:130
    })
    @IsNumber()
    @IsNotEmpty()
    price:number;

    @ApiProperty({
        description:'category should be a string',
        example:'footwear'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(96)
    @MinLength(3)
    category:string;

    @ApiProperty({
        description:'rating should be a number',
        example:4
    })
    @IsNumber()
    @IsOptional()
    rating?:number;

    @ApiProperty({
        description:'featuredImageUrl should be a string',
        example:"https://example.com/images/nike-air-max-1.jpg"
    })
    @IsString()
    @IsOptional()
    featuredImageUrl?:string;

    @ApiProperty({
        description:'slug should be a string with hyphen',
        example:"nike-air-max-2024"
    })
    @IsString()
    @IsOptional()
    @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    slug?:string;

}