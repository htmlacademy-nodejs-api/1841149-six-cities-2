import { UserType } from './user-type.enum.js';

export type Author = {
  name: string;
  email: string;
  avatar: string;
  userType: UserType;
}
