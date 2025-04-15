import { IsNumber, IsOptional, IsString } from "class-validator";
import { IntersectionType } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";
class GetProductsBaseDto{
    @IsOptional()
    @IsString()
    category?:string;

    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    maxPrice?: number;
}
//for adding additional queryparameters
export class GetProductsDto extends IntersectionType(
    GetProductsBaseDto,
    PaginationQueryDto
){}   