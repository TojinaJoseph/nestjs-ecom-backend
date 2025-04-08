import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
    constructor(
        @Inject(forwardRef(()=>UsersService))
        private readonly usersService:UsersService,

        private readonly hashingProvider:HashingProvider,

        private readonly generateTokenProvider:GenerateTokensProvider
    ){}
    public async signIn(signInDto:SignInDto){
          //find user using emailId
        //Throw an error if not found
       let user=await this.usersService.findOneByEmail(signInDto.email)

        //Compare password to the hash
        let isEqual:boolean=false;
        try {
            isEqual=await this.hashingProvider.comparePassword(
                signInDto.password,
                user.password
            )
        } catch (error) {
            throw new RequestTimeoutException(error,{
                description:"could not compare password"
            })
        }


        if(!isEqual){
            throw new UnauthorizedException('Incorrect password')
        }
        //send confirmation,jwt generation
       return await this.generateTokenProvider.generateTokens(user)
    }
}
