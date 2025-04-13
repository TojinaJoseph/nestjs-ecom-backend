import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './providers/orderService';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService:OrderService
    ){}
    @ApiOperation({
        summary:"fetch all orders"
      })
      @ApiResponse({
        status:200,
        description:"orders fetched successfully"
      })
    @Get()
    public getOrders(){
        return this.orderService.findOrders();
    }

    @ApiOperation({
        summary:"fetch one order based on id"
      })
      @ApiResponse({
        status:200,
        description:"order fetched successfully"
      })
    @Get('/:orderId')
    public getOneOrderById(@Param('orderId') orderId:number){
        return this.orderService.getOneOrder(orderId)
    }
    @Post()
    public createOrder(@ActiveUser() user:ActiveUserData,@Body() createOrderDto: CreateOrderDto){
        console.log(user.sub)
        return this.orderService.createOrder(user,createOrderDto)
    }
    @Delete('/:id')
    public deleteOrder(@Param('id') id:number){
        return this.orderService.deleteOrder(id);
    }
    
}
