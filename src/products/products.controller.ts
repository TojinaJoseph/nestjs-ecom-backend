import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchProductDto } from './dtos/patch-product.dto';

@ApiTags("Products")
@Controller('products')
export class ProductsController {

    constructor(

        //product service Inject
        private readonly productsService:ProductsService
    
    ){}

// route for getting one product

    @Get('/:id')
    @ApiOperation({
      summary:"fetch a product"
    })
    @ApiResponse({
      status:200,
      description:"product fetched successfully"
    })
    public getProduct(@Param('id',ParseIntPipe) id:number){
       return this.productsService.getProductById(id)
    }

// route for getting products

    @Get()
    @ApiOperation({
      summary:"fetch all products"
    })
    @ApiResponse({
      status:200,
      description:"products fetched successfully"
    })
    public getProducts(){
       return this.productsService.getProducts()
    }

//route for creating product

   @Post()
   @ApiOperation({
      summary:"create a product"
    })
    @ApiResponse({
      status:200,
      description:"products created successfully"
    })
   public createProduct(@Body() createProductDto:CreateProductDto){
    return this.productsService.createProduct(createProductDto)
   }

//route for upating product - patch

   @Patch()
   @ApiOperation({
      summary:"update a product"
    })
    @ApiResponse({
      status:200,
      description:"products updated successfully"
    })
   public updateProduct(@Body() patchProductDto:PatchProductDto){
    return this.productsService.updateProduct(patchProductDto)
   }

//route for deleting product

   @Delete()
   @ApiOperation({
      summary:"delete a product"
    })
    @ApiResponse({
      status:200,
      description:"products deleted successfully"
    })
   public deleteProduct(@Query('id',ParseIntPipe) id:number){
    return this.productsService.deleteProduct(id)
   }

}
