import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../cart-item.entity';
import { Repository } from 'typeorm';
import { Cart } from '../cart.entity';
import { Products } from 'src/products/products.entity';
import { UsersService } from 'src/users/providers/users.service';
import { Users } from 'src/users/users.entity';

@Injectable()
export class CartService {

    constructor(
            @InjectRepository(Cart)
            private readonly cartRepository:Repository<Cart>,

            @InjectRepository(CartItem)
            private readonly cartItemRepository:Repository<CartItem>,

            @InjectRepository(Products)
            private readonly productRepository:Repository<Products>,

            @InjectRepository(Users)
            private readonly userRepository:Repository<Users>,

        ){}

    public async getCart(userid:number){
        let user;
        try {
            user=await this.userRepository.findOneBy({id:userid})
            console.log(user)
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }

        if(!user){
            throw new BadRequestException('User not exist')
        }
        
        let cart= await this.cartRepository.findOne({
            where:{user:{id:userid}}
        })
        return cart;
    }

    public async addCartItem(userId:number,productId:number){
         //check for existing cartitem
                let existingCartItem;
                let carts;
                let product;
                try {

                   product=await this.productRepository.findOneBy({id:productId})

                    let [cart]=await this.cartRepository.find({where:{user:{id:userId}}})
                    carts=cart

                    existingCartItem=await this.cartItemRepository.findOne({
                        where:{product:{id:productId},cart:{id:cart.id}}
                    })
                } catch (error) {
                    throw new RequestTimeoutException('Unable to process your request,please try again',{
                        description:'Error connecting to database'
                    })
                }
               
                
                if(existingCartItem){
                    let quantity=existingCartItem.quantity+1
                    let price=product.price*quantity
                    let updatedCartItem={...existingCartItem,quantity:quantity,price:price}
                    let newcartItem=await this.cartItemRepository.save(updatedCartItem);
                    return newcartItem;             
                }


    let cartItem = this.cartItemRepository.create({product:{id:productId},cart:{id:carts.id}});

    cartItem={...cartItem,quantity:1,price:product?.price || 0}

    // let cartItem=this.cartItemRepository.findOne({where:{product:{id:productId}}})

    let newcartItem=await this.cartItemRepository.save(cartItem);

    return newcartItem;

    }

    public async deleteCartItem(cartitemid:number){
        let cartitem
        try {
             cartitem=await this.cartItemRepository.findOneBy({id:cartitemid})        
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }
        if(cartitem.quantity>=2){
            let quantity=cartitem.quantity-1;
            let price=cartitem.product.price*quantity
            let updatedCartItem={...cartitem,quantity:quantity,price:price}
            await this.cartItemRepository.save(updatedCartItem)
            return {updated:true,cartitemid}

        }
        await this.cartItemRepository.delete(cartitemid)
        return {deleted:true,cartitemid}
    }

    // public async updateCartItem(data:CartItemDto){
    //     return "api for updating a cart item"
    // }
}
