import { Injectable ,Inject, forwardRef} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=>UsersService))
        private readonly usersService:UsersService,

        private readonly signInProvider:SignInProvider,

        private readonly refreshTokensProvider:RefreshTokensProvider,

    ){}

    public async signIn(signInDto:SignInDto){
       return await this.signInProvider.signIn(signInDto)
    }

    public async refreshTokens(refreshTokenDto:RefreshTokenDto){
        return await this.refreshTokensProvider.refreshTokens(refreshTokenDto)
     }

     public async signOut(user: ActiveUserData){
        return `${user.email} has been logged out`;
     }
}
