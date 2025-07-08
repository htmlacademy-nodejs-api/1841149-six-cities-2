import { IsString, Length } from 'class-validator';
import { LoginUserMessages } from './login-user.messages.js';

export class LoginUserDto {
  @IsString({ message: LoginUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: LoginUserMessages.password.invalidFormat })
  @Length(6, 12, { message: LoginUserMessages.password.length })
  public password: string;
}
