import { UserType } from '../../../types/index.js';

export type TokenPayload = {
  email: string;
  name: string;
  id: string;
  userType: UserType;
};
