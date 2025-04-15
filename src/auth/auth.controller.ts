import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { API_BEARER_AUTH } from 'src/common/constants/auth.constants';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth(API_BEARER_AUTH)
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){}
@Post('sign-in')
@HttpCode(HttpStatus.OK)
@Auth(AuthType.None)
  public async signIn(@Body() signInDto:SignInDto){
    return this.authService.signIn(signInDto)
  }

  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
    public async refreshTokens(@Body() refreshTokenDto:RefreshTokenDto){
      return this.authService.refreshTokens(refreshTokenDto)
    } 

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  public async signOut(@ActiveUser() user:ActiveUserData){
    return this.authService.signOut(user)
  }
}
