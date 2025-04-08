import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto{
@ApiProperty({
  description:'It should be a refresh token',
  example:'hjhjhjj'
        })
@IsNotEmpty()
@IsString()
refreshToken: string;
}