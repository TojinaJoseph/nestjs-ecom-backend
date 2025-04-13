import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  price: number;
}
