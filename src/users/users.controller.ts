import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto} from './dtos/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchUserDto } from './dtos/patch-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorators/roles.decorator.decorator';
import { Role } from 'src/auth/enums/roles-type.enum';
import { API_BEARER_AUTH } from 'src/common/constants/auth.constants';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth(API_BEARER_AUTH)
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
// @SetMetadata('authType','none')
@Auth(AuthType.None)   //custom decorator
@ApiOperation({
    summary:'Create a user'
})
@ApiResponse({
    status:200,
    description:'User created successfully.'
})
@UseInterceptors(ClassSerializerInterceptor)
public createUser(@Body() createUserDto:CreateUserDto){
    console.log(createUserDto)
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
public updateUser(
    @Body() patchUserDto:PatchUserDto,
    @ActiveUser() user:ActiveUserData      //for getting user from the jwt payload
){
    console.log(user);
    return this.usersService.updateUser(patchUserDto);
}

// @UseGuards(AccessTokenGuard)   //guards for single route
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
@Roles(Role.Admin)
public deleteUser(@Query('id',ParseIntPipe) id:number){
    return this.usersService.deleteUser(id);
}
}
