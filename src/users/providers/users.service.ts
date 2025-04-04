import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,

        private readonly configService:ConfigService
    ){}
    public async getUsers(){
        let envVariable=process.env.NODE_ENV;
        console.log(envVariable)
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
            user.firstName=patchUserDto.firstName;
            user.lastName=patchUserDto.lastName;
            user.email=patchUserDto.email;
            user.password=patchUserDto.password;
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
}
