import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('products')
export class ProductsController {

    constructor(

        //product service Inject
        private readonly productsService:ProductsService
    
    ){}

// route for getting products

    @Get('/:id')
    public getProduct(@Param('id',ParseIntPipe) id:number){
       return this.productsService.getProduct(id)
    }

// route for getting products

    @Get()
    public getProducts(){
       return this.productsService.getProducts()
    }

//route for creating product

   @Post()
   public createProduct(@Body() createProductDto:CreateProductDto){
    return this.productsService.createProduct(createProductDto)
   }

//route for creating product

   @Patch()
   public updateProduct(){
    return this.productsService.updateProduct()
   }

//route for creating product

   @Delete()
   public deleteProduct(){
    return this.productsService.deleteProduct()
   }

}
