import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
   constructor(
    private readonly jwtService:JwtService,
                   
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
     private readonly generateTokenProvider:GenerateTokensProvider,
    @Inject(forwardRef(()=>UsersService))
        private readonly usersService:UsersService,

     
   ){}
    public async refreshTokens(refreshTokenDto:RefreshTokenDto){
        try {
             //veriry refreshtoken using jwtservice
       const {sub}=await this.jwtService.verifyAsync<Pick<ActiveUserData,'sub'>>(refreshTokenDto.refreshToken,{
        secret:this.jwtConfiguration.secret,
        audience:this.jwtConfiguration.audience,
        issuer:this.jwtConfiguration.issuer
       })
        //fetch user from database
       const user=await this.usersService.getUser(sub);
        //generate tokens

        return await this.generateTokenProvider.generateTokens(user)
        } catch (error) {
            throw new UnauthorizedException(error)
        }
       
    }
}
