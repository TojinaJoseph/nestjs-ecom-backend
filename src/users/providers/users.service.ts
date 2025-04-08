import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,

        private readonly configService:ConfigService,

        @Inject(forwardRef(()=>AuthService))
        private readonly authService:AuthService,

        private readonly createUserProvider:CreateUserProvider,

        private readonly findOneUserByEmailProvider:FindOneUserByEmailProvider,
        
        @InjectRepository(Cart)
        private readonly cartRepository:Repository<Cart>,



    ){}
    public async getUsers(){
        let users;
        try {
            users=await this.usersRepository.find({
                relations:{
                    cart:true             //when fetching users it will fetch cart also
                }
            });
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }
        return users;
    }
    public async getUser(id:number){
        let user;
        try {
            user=await this.usersRepository.findOneBy({id});
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }

        if(!user){
            throw new BadRequestException('User not exist')
        }
        return user;
    }
    public async createUser(createUserDto:CreateUserDto){
        //check for existing user with same email
        let existingUser;
        try {
            existingUser=await this.usersRepository.findOne({
                where:{email:createUserDto.email}
            })
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }
       
        //handle exception
        if(existingUser){
            throw new BadRequestException('User already exist')
        }

        //create new user
        let newUser=this.usersRepository.create(createUserDto);

        try {
            newUser=await this.usersRepository.save(newUser);

            // Create cart manually

                    const cart = this.cartRepository.create({user:{id:newUser.id}});
                     await this.cartRepository.save(cart);

                    newUser.cart = cart;
                    await this.usersRepository.save(newUser); // now the cartId gets set

        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }
        
        return newUser;
    }
    public async updateUser(patchUserDto:PatchUserDto){
        let user;
        try {
            user=await this.usersRepository.findOneBy({id:patchUserDto.id})
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            })
        }

        if(!user){
            throw new BadRequestException('User not exist')
        }

        if(user){
    
            user.firstName=patchUserDto.firstName?patchUserDto.firstName:user.firstName;
            user.lastName=patchUserDto.lastName?patchUserDto.lastName:user.lastName;
            user.email=patchUserDto.email?patchUserDto.email:user.email;
            user.password=patchUserDto.password?patchUserDto.password:user.password;
        }
        try {
            await this.usersRepository.save(user)
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            }) 
        }
        return user;
    }
    public async deleteUser(id:number){

        let user;
        try {
            user=this.usersRepository.findOneBy({id})
        } catch (error) {
            throw new RequestTimeoutException('Unable to process your request,please try again',{
                description:'Error connecting to database'
            }) 
        }

        if(!user){
            throw new BadRequestException('User not exist')
        }

        if(user){
            try {
                await this.usersRepository.delete(id)
            } catch (error) {
                throw new RequestTimeoutException('Unable to process your request,please try again',{
                    description:'Error connecting to database2'
                }) 
            }
            
        }
        
        return {deleted:true,id};
    }
    public async findOneByEmail(email:string){
      return this.findOneUserByEmailProvider.findOneByEmail(email);
    }
}
