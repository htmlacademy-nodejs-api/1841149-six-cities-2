import { UserType } from '../../../types/index.js';

export class CreateUserDto {
  public name: string;
  public email: string;
  public avatar: string;
  public password: string;
  public userType: UserType;
}
