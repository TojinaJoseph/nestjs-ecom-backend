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

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,

        private readonly configService:ConfigService,

        @Inject(forwardRef(()=>AuthService))
        private readonly authService:AuthService,

        private readonly createUserProvider:CreateUserProvider,

        private readonly findOneUserByEmailProvider:FindOneUserByEmailProvider
    ){}
    public async getUsers(){
        let users;
        try {
            users=await this.usersRepository.find();
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
      return this.createUserProvider.createUser(createUserDto)
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
                    description:'Error connecting to database'
                }) 
            }
            
        }
        
        return {deleted:true,id};
    }
    public async findOneByEmail(email:string){
      return this.findOneUserByEmailProvider.findOneByEmail(email);
    }
}
