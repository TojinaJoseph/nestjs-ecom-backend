import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, IsInt } from "class-validator";

export class ShippingAddressDto {
    @ApiProperty({
              description:'It should be a string',
              example:'Tojina'
          })
    @IsString()
    fullName: string;
    
    @ApiProperty({
        description:'It should be a string',
        example:'hjhjhj'
    })
    @IsString()
    addressLine1: string;

    @ApiPropertyOptional({
        description:'It should be a string',
        example:'hjhj'
    })
    @IsString()
    @IsOptional()
    addressLine2: string;

    @ApiProperty({
        description:'It should be a string',
        example:'hjhj'
    })
    @IsString()
    city: string;

    @ApiProperty({
        description:'It should be a string',
        example:'kerala'
    })
    @IsString()
    state: string;

    @ApiProperty({
        description:'It should be an integer',
        example:676868
    })
    @IsInt()
    postalCode: number;

    @ApiProperty({
        description:'It should be a string',
        example:'India'
    })
    @IsString()
    country: string;
    
    @ApiProperty({
        description:'It should be a number',
        example:7878788
    })
    @IsNumber()
    phoneNumber: number;
}