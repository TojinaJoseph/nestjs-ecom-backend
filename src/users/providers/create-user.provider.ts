import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,

        @Inject(forwardRef(()=>HashingProvider))
        private readonly hashingProvider:HashingProvider,

        @InjectRepository(Cart)
        private readonly cartRepository:Repository<Cart>,
    ){}
    public async createUser(createUserDto:CreateUserDto){

        
            //check for existing user with same email
            let existingUser;
            try {
                existingUser=await this.usersRepository.findOne({
                    where:{email:createUserDto.email}
                })
            } catch (error) {
                console.log(error)
                throw new RequestTimeoutException('Unable to process your request,please try again',{
                    description:'Error connecting to database'
                })
            }
           
            //handle exception
            if(existingUser){
                throw new BadRequestException('User already exist')
            }
    
            //create new user
            let newUser=this.usersRepository.create({
                ...createUserDto,
                password:await this.hashingProvider.hashPassword(createUserDto.password)
            });
            
            try {
                newUser=await this.usersRepository.save(newUser);
                 // Create cart manually

                 const cart = this.cartRepository.create({user:{id:newUser.id}});
                 await this.cartRepository.save(cart);

                newUser.cart = cart;
                await this.usersRepository.save(newUser); // now the cartId gets set
            } catch (error) {
                console.log(error)
                throw new RequestTimeoutException('Unable to process your request,please try again',{
                    description:'Error connecting to database'
                })
            }
            
            return newUser;
        
        }
}
