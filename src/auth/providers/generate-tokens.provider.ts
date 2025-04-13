import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Users } from 'src/users/users.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
    constructor(
       private readonly jwtService:JwtService,
               
       @Inject(jwtConfig.KEY)
       private readonly jwtConfiguration: ConfigType<typeof jwtConfig> 
    ){}

    public async signToken<T>(userId:number,expiresIn:number,payload?:T){
        return await this.jwtService.signAsync({
                    sub:userId,
                    ...payload
                },{
                   audience: this.jwtConfiguration.audience,
                   issuer: this.jwtConfiguration.issuer,
                   secret: this.jwtConfiguration.secret,
                   expiresIn
                },
            );
    }

    public async generateTokens(user:Users){
        const [accessToken,refreshToken]=await Promise.all([
  //generate access token
  this.signToken<Partial<ActiveUserData>>(user.id,this.jwtConfiguration.accessTokenTtl,{email:user.email,role:user.role}),
  //generate refreshtoken
  this.signToken(user.id,this.jwtConfiguration.refreshTokenTtl)
        ])
 return{
    accessToken,
    refreshToken
 }
    }
}
