import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto} from './dtos/create-user.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}

@Get()
@ApiOperation({
    summary:'Fetches a list registered users'
})
@ApiResponse({
    status:200,
    description:'Users fetched successfully.'
})
public getUsers(){
    return this.usersService.getUsers();
}

@Get('/:id')
@ApiOperation({
    summary:'Fetches a registered user'
})
@ApiResponse({
    status:200,
    description:'User fetched successfully.'
})
public getUser(@Param('id',ParseIntPipe) id:number){
    return this.usersService.getUser(id);
}

@Post()
@ApiOperation({
    summary:'Create a user'
})
@ApiResponse({
    status:200,
    description:'User created successfully.'
})
@UseInterceptors(ClassSerializerInterceptor)
public createUser(@Body() createUserDto:CreateUserDto){
    return this.usersService.createUser(createUserDto);
}

@Patch()
@ApiOperation({
    summary:'Update the user'
})
@ApiResponse({
    status:200,
    description:'User updated successfully.'
})
public updateUser(@Body() patchUserDto:PatchUserDto){
    return this.usersService.updateUser(patchUserDto);
}

@Delete()
@ApiOperation({
    summary:'Delete the registered user'
})
@ApiResponse({
    status:200,
    description:'User deleted successfully.'
})
@ApiQuery({
    name:"id",
    type:"number",
    description:"The id of user to delete",
    example:1
})
public deleteUser(@Query('id',ParseIntPipe) id:number){
    return this.usersService.deleteUser(id);
}
}
