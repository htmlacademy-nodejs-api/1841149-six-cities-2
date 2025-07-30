import { UserDto } from '../user/user.dto';

export interface CommentDto {
  id: string;
  text: string;
  rating: number;
  createdAt: string;
  user: UserDto;
}
