import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto} from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}

@Get()
public getUsers(){
    return this.usersService.getUsers();
}

@Get('/:id')
public getUser(@Param('id',ParseIntPipe) id:number){
    return this.usersService.getUser(id);
}

@Post()
public createUser(@Body() createUserDto:CreateUserDto){
    return this.usersService.createUser(createUserDto);
}

@Patch()
public updateUser(){
    return this.usersService.updateUser();
}

@Delete()
public deleteUser(){
    return this.usersService.deleteUser();
}
}
