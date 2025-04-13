import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../products.entity';
import { Repository } from 'typeorm';
import { PatchProductDto } from '../dtos/patch-product.dto';
import { ConfigService } from '@nestjs/config';
import { CartItem } from 'src/cart/cart-item.entity';
import { GetProductsDto } from '../dtos/get-products.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider.ts';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Products)
        private readonly productsRepository:Repository<Products>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository:Repository<CartItem>,

        //inject configservice for env variables

        private readonly configService:ConfigService,

        private readonly paginationProvider:PaginationProvider,
    ){}

     //service for get one product

     public async getProductById(id:number){  

        let product;
        try {
            product= await this.productsRepository.findOneBy({id})
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again later',{
                description:'Error connecting to database'
            })
        }

        if(!product){
            throw new BadRequestException('The product doesnot exists')
        }
        return product;
    }

    //service for get all products

    public async getProducts(productQuery: GetProductsDto):Promise<Paginated<Products>>{
        let products=await this.paginationProvider.paginateQuery({
            limit:productQuery.limit,
            page:productQuery.page
        },
        this.productsRepository
    )
    return products;
    }

    //service for creating product

    public async createProduct(data:CreateProductDto){

        //check for product

        let existingProduct;

        try {
            //check for unique title
         existingProduct=await this.productsRepository.findOne({    
            where:{
                title:data.title
            }
        })
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again later',{
                description:'Error connecting to database'
            })
        }    
        if(existingProduct){
            throw new BadRequestException('The product already exists')
        }
        
        //create a new product

        let newProduct=this.productsRepository.create(data)
       console.log("in createproduct");
        try {
            newProduct=await this.productsRepository.save(newProduct) 
            console.log(newProduct)
        } catch (error) {
            console.error("Error saving product:", error);
            throw new RequestTimeoutException('Unable to process your request,please try again later',{
                description:'Error connecting to database'
            })  
        }

        return newProduct;
    }

    //service for updating product

    public async updateProduct(data:PatchProductDto){

        //check for product

        let product;
        try {
            product=await this.productsRepository.findOneBy({
                id:data.id
            })
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again later',{
                description:'Error connecting to database'
            })   
        }
        if(!product){
            throw new BadRequestException("The product does not exist")
        }

        if(product){
                product.title=data.title??product.title
                product.description=data.description??product.description
                product.price=data.price??product.price
                product.category=data.category??product.category
                product.featuredImageUrl=data.featuredImageUrl??product.featuredImageUrl
                product.rating=data.rating??product.rating
                product.slug=data.slug??product.slug

            try {
                await this.productsRepository.save(product)
            } catch (error) {
                throw new RequestTimeoutException('Unable to process your request,please try again later',{
                    description:'Error connecting to database'
                })   
            }
         return product;

        }
    }

    //service for deleting product

    public async deleteProduct(id:number){

        //check whether product is there or not
        let existingProduct;
        try {
         existingProduct=await this.productsRepository.findOne({    
            where:{
                id:id
            }
        })
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again later',{
                description:'Error connecting to database'
            })
        }    
        if(!existingProduct){
            throw new BadRequestException('The product does not exists')
        }
        if(existingProduct){
            try {
                await this.productsRepository.delete(id) 
             } catch (error) {
                 throw new RequestTimeoutException('Unable to process your request,please try again later',{
                     description:'Error connecting to database'
                 }) 
             }
             return {deleted:true,id}
        }
       
    }

  
}
