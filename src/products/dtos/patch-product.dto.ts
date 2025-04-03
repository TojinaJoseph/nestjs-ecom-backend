import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class PatchProductDto extends PartialType(CreateProductDto) {
    
@ApiProperty({
    description:"the id of the product that need to be updated"
})
@IsInt()
@IsNotEmpty()
id:number
}