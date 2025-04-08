import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
    constructor(
        @InjectRepository(Users)  
        private readonly usersRepository:Repository<Users>
    ){}

    public async findOneByEmail(email:string){
        let user;
        try {
           user=await this.usersRepository.findOneBy({
            email: email,
           }) 
        } catch (error) {
            throw new RequestTimeoutException(error,{
                description: 'could not fetch the user'
            })
        }


        if(!user){
            throw new UnauthorizedException('User does not exist')
        }

        return user;
    }
}
