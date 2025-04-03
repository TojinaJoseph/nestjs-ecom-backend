import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
    public getUsers(){
        return "api to get users";
    }
    public getUser(id:number){
        console.log(typeof id)
        return `api to get user of ${id}`;
    }
    public createUser(createUserDto:CreateUserDto){
        console.log(createUserDto instanceof CreateUserDto)
        return "product created";
    }
    public updateUser(){
        return "product updated";
    }
    public deleteUser(){
        return "product deleted";
    }
}
