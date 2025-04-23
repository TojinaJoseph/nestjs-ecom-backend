import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchProductDto } from './dtos/patch-product.dto';
import { CartService } from 'src/cart/providers/cart.service';
import { Roles } from 'src/auth/decorators/roles.decorator.decorator';
import { Role } from 'src/auth/enums/roles-type.enum';
import { GetProductsDto } from './dtos/get-products.dto';
import { API_BEARER_AUTH } from 'src/common/constants/auth.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@ApiTags("Products")
@Controller('products')
@ApiBearerAuth(API_BEARER_AUTH)
export class ProductsController {

    constructor(

        //product service Inject
        private readonly productsService:ProductsService,

        private readonly cartService:CartService
    
    ){}

// route for getting one product

    @Get('/:id')
    @Auth(AuthType.None)
    @ApiBearerAuth()
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
    @Auth(AuthType.None) 
    @ApiOperation({
      summary:"fetch all products"
    })
    @ApiResponse({
      status:200,
      description:"products fetched successfully"
    })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    public getProducts(@Query() productQuery: GetProductsDto){
       return this.productsService.getProducts(productQuery)
    }

//route for creating product

   @Post()
   @Roles(Role.Admin)
   @UseInterceptors(FileInterceptor('image'))
   @ApiOperation({
      summary:"create a product"
    })
    @ApiResponse({
      status:200,
      description:"products created successfully"
    })
    // @UseInterceptors(FileInterceptor('image', {
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: (req, file, callback) => {
    //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //       const ext = extname(file.originalname);
    //       const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    //       callback(null, filename);
    //     },
    //   }),
    // }))
  //  public createProduct(@UploadedFile() file: Express.Multer.File,@Body() createProductDto:CreateProductDto){
   public createProduct(@UploadedFile() file: Express.Multer.File,@Body() createProductDto:CreateProductDto){
    
  // const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
  //   const productWithImage = {
  //     ...createProductDto,
  //     featuredImageUrl: imageUrl,
  //   };
    // return this.productsService.createProduct(productWithImage)
    return this.productsService.createProduct(file,createProductDto)
   }

//route for upating product - patch

   @Patch()
   @Roles(Role.Admin)
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
   @Roles(Role.Admin)
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

   //route for add to cart

   @Post("/:userId/:productId/addToCart")
   @ApiOperation({
    summary:"add to cart"
  })
  @ApiResponse({
    status:200,
    description:"product added to cart successfully"
  })
 public addToCart(@Param('userId',ParseIntPipe) userId:number,@Param('productId',ParseIntPipe) productId:number){
  return this.cartService.addCartItem(userId,productId)
 }
   

}

