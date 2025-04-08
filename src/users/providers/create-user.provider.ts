import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,

        @Inject(forwardRef(()=>HashingProvider))
        private readonly hashingProvider:HashingProvider
    ){}
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
            let newUser=this.usersRepository.create({
                ...createUserDto,
                password:await this.hashingProvider.hashPassword(createUserDto.password)
            });
            
            try {
                newUser=await this.usersRepository.save(newUser);
            } catch (error) {
                throw new RequestTimeoutException('Unable to process your request,please try again',{
                    description:'Error connecting to database'
                })
            }
            
            return newUser;
        
        }
}
