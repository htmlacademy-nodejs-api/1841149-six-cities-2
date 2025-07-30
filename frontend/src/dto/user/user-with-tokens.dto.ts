import {UserTypeDto} from './user-type-dto.enum';

export interface UserWithTokensDto {
  id: string;
  email: string;
  name: string;
  avatar: string;
  userType: UserTypeDto,
  accessToken: string;
  refreshToken: string;
}
