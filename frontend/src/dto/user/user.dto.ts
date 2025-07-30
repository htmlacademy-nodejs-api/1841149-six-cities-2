export enum UserType {
  default = 'default',
  pro = 'pro'
}

export interface UserDto {
  name: string;
  email: string;
  avatar: string;
  userType: UserType;
}
