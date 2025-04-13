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
import { Roles } from 'src/auth/decorators/roles.decorator.decorator';

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

          //checking whether order is already created or not based on userId;
         const [Order]=await this.orderRepository.find({
            where:{user:{id:activeUser.sub}}
         })
         const orders=Order
         if(orders){
            return {
                message:"Order already exist"
            }
         }

        //fetch cartitems using the userid and add to the order
        let cartItems;
        let user;
        try {

            user=await this.usersService.getUser(activeUser.sub);
            cartItems=await this.cartService.getCart(activeUser.sub);
           
            
        } catch (error) {
            
             throw new ConflictException(error)
        }
       

        if (!cartItems || cartItems.items.length === 0) {
            return {
                message:"No items found in the cart"
            }
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

        let order=this.orderRepository.create({
            ...createOrderDto,
            user:user,
            items:await this.orderItemRepository.save(orderItems),
            totalPrice:totalPrice
        })

        //return the order
        try {
            return await this.orderRepository.save(order);
        } catch (error) {
            throw new ConflictException(error);
        }
        
    }
    public async findOrders(){
        return this.orderRepository.find();
    }
    public async getOneOrder(orderId:number){
        return this.orderRepository.findOneBy({id:orderId})
    }
    
    public async deleteOrder(id:number){   
         //as shippingaddress and order are one to one related
        //Delete order first as foreign key is in order otherwise foreign key constraint occur
        //finding order from shippingaddressrepository as it is now bidirectional one to one
        //delete the order
        try {
            await this.orderRepository.delete(id);   //deleting order will auto delete shipping address
        } catch (error) {
            console.log(error)
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }
        return{deleted:true,id}
    }
}
