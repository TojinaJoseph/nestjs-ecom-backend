
import { IsOptional, IsPositive } from "class-validator";
 
export class PaginationQueryDto{               //common pagination for all entities
    @IsOptional()
    @IsPositive()  
    limit?: number=10;

    @IsOptional()
    @IsPositive()
    page?: number=1;
}