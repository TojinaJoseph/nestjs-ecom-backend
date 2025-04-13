import { BadRequestException, ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { Order } from '../order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from '../shipping-address.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { CartService } from 'src/cart/providers/cart.service';
import { ShippingAddressDto } from '../dtos/create-shipping-address.dto';
import { UsersService } from 'src/users/providers/users.service';
import { OrderItem } from '../order-item.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository:Repository<Order>,

        private readonly cartService:CartService,

        private readonly usersService:UsersService,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository:Repository<OrderItem>
    ){}
    public async createOrder(activeUser:ActiveUserData, createOrderDto:CreateOrderDto){
        //fetch cartitems using the userid and add to the order
        console.log(activeUser.sub)
        let cartItems;
        let user;
        try {

            user=await this.usersService.getUser(activeUser.sub);
            cartItems=await this.cartService.getCart(activeUser.sub);
            console.log(cartItems.items);
            
        } catch (error) {
            console.log("error")
             throw new ConflictException(error)
        }
       

        if (!cartItems || cartItems.length === 0) {
            throw new Error('No items found in the cart');
          }
        //create shipping address  - auto creation because we use cascade in order entity


        //create orderitem

        // const orderItems=this.orderItemRepository.create({product:{id:}})
        const orderItems = cartItems.items.map((cartItem) => {
            const orderItem = new OrderItem();
            orderItem.product = cartItem.product; // Assuming CartItem has a Product relation
            orderItem.quantity = cartItem.quantity;
            orderItem.price = cartItem.product.price; // Assuming price is available in Product
            return orderItem;
          });

          const totalPrice = orderItems.reduce((sum, item) => {
            return sum + item.quantity * item.price;
          }, 0);
        //create an order
        console.log(user.id)
          // Step 3: Create Order with the order items
    // const order = new Order();
    // order.status = status;
    // order.shippingAddress = shippingAddress; // assuming address is correctly set
    // order.items = await this.orderItemRepository.save(orderItems); // Save order items

        let order=this.orderRepository.create({
            ...createOrderDto,
            user:user,
            items:await this.orderItemRepository.save(orderItems),
            totalPrice:totalPrice
        })

        //add shipping address to the order
        // if(shippingAddress && cartItems){
        //     order.shippingAddress=shippingAddress
        //     // order.items=cartItems.items
        // }
        
        console.log(order);

        //return the order
        try {
            return await this.orderRepository.save(order);
        } catch (error) {
            throw new ConflictException(error);
        }
        
    }
    public async findOrders(){
        const orders =this.orderRepository.find();
        return orders
    }
    public async getOneOrder(orderId:number){
        return this.orderRepository.findOneBy({id:orderId})
    }
    
    public async deleteOrder(id:number){    //as shippingaddress and order are one to one related
        //find the order                        //Delete order first as foreign key is in order otherwise foreign key constraint occur
        //  let order;
        // try {
        //     order=await this.orderRepository.findOneBy({id})
        //  } catch (error) {
        //     throw new RequestTimeoutException('Unable to process your request,please try again',{
        //         description:'Error connecting to database'
        //     })
        //  }


        //  let inverseOrder=await this.shippingAddressRepository.find({         //finding order from shippingaddressrepository as it is now bidirectional one to one
        //     where:{id:order.shippingAddress.id},
        //     relations:{
        //         order: true,
        //     }
        //  })



        

        //  if(!order){
        //     throw new BadRequestException('order not exist');
        //    }
       
        //delete the order
        try {
            await this.orderRepository.delete(id);
        } catch (error) {
            console.log(error)
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }
        
        // //delete the shipping address
        // try {
        //     await this.shippingAddressRepository.delete(order.shippingAddress.id)
        // } catch (error) {
        //     throw new RequestTimeoutException('Unable to process your request,please try again',{
        //         description:'Error connecting to database'
        //     })
        // }
       
        
        //confirmation
        return{deleted:true,id}
    }
}
