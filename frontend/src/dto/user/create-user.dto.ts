import {UserTypeDto} from './user-type-dto.enum';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  userType: UserTypeDto;
}
