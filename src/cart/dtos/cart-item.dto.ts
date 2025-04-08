import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";


export class CartItemDto{

    @ApiProperty({
        description:'price should be a number',
        example:130
    })
    @IsNumber()
    @IsNotEmpty()
    price:number;

    @ApiProperty({
        description:'price should be a number',
        example:2
    })
    @IsNumber()
    @IsNotEmpty()
    quantity:number;

}