import { UserType } from './user-type.enum.js';

export type Author = {
  name: string;
  email: string;
  avatar: string;
  password: string;
  userType: UserType;
}
