import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class ProductsService {

     //service for get one product

     public getProduct(id:number){
        console.log(typeof id)
        return `api to get one product of id ${id}`
    }

    //service for get products

    public getProducts(){
        return "api to get products"
    }

    //service for creating product

    public createProduct(data:CreateProductDto){
        console.log(data)
        console.log(typeof data)
        console.log(data instanceof CreateProductDto)


        return "api for creating product"
    }

    //service for creating product

    public updateProduct(){
        return "api for updating product"
    }

    //service for creating product

    public deleteProduct(){
        return "api for deleting product"
    }
}
