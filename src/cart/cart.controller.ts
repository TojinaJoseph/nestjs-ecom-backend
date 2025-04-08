import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CartService } from './providers/cart.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartItemDto } from './dtos/cart-item.dto';

@ApiTags("Cart")
@Controller('cart')
export class CartController {
    constructor(private readonly cartService:CartService){}

    @Get()
     @ApiOperation({
          summary:"fetch a cart based on user"
        })
        @ApiResponse({
          status:200,
          description:"cart fetched successfully"
        })
    public async getCartItem(@Query('userid',ParseIntPipe) userid:number){
        return await this.cartService.getCart(userid)
    }

    // @Post()
    // @ApiOperation({
    //     summary:"add an item"
    //   })
    //   @ApiResponse({
    //     status:200,
    //     description:"item added successfully"
    //   })
    // public async addCartItem(@Body() cartItemDto:CartItemDto){
    //     return await this.cartService.addCartItem(cartItemDto)
    // }

    // @Patch()
    // @ApiOperation({
    //     summary:"update a cartitem"
    //   })
    //   @ApiResponse({
    //     status:200,
    //     description:"cartitem updated successfully"
    //   })
    // public async updateCartItem(@Body() cartItemDto:CartItemDto){
    //     return await this.cartService.updateCartItem(cartItemDto)
    // }

    @Delete("/:cartitemid")
    @ApiOperation({
        summary:"delete an item"
      })
      @ApiResponse({
        status:200,
        description:"cartitem deleted successfully"
      })
    public async deleteCartItem(@Param('cartitemid',ParseIntPipe) cartitemid:number){
        return await this.cartService.deleteCartItem(cartitemid)
    }
}
