
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '../enums/status-type.enum';
import { ShippingAddressDto } from './create-shipping-address.dto';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
//   @ApiProperty({
//     description:'It should be an array of items',
//     example:'hjhjhj'
// })
//   @IsArray()
//   items: OrderItemDto[];

  @ApiProperty({
    description:'It should be an address',
    example:{
        fullName: "Tojina Joseph",
        addressLine1: "",
        city: "Kottayam",
        state: "Kerala",
        postalCode: 345346,
        country: "India",
        phoneNumber: 7878787788
  }
})
  @ValidateNested()
  shippingAddress: ShippingAddressDto;

  @ApiProperty({
          description:'It should be a string',
          example:'Pending'
      })
  @IsEnum(StatusType, { message: 'Status must be one of: Pending, Shipped,Delivered,Cancelled' })
  @IsString()
  @IsNotEmpty()
  status: StatusType;
 }
