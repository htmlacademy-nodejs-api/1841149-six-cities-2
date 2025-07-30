import { UserEntity } from '../user/index.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { AuthEntity } from './auth.entity.js';
import { TokensRdo } from './rdo/tokens.rdo.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<TokensRdo>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
  create(dto: CreateAuthDto): Promise<DocumentType<AuthEntity>>;
  findByUserId(userId: string): Promise<DocumentType<AuthEntity> | null>;
  update(user: UserEntity, refreshToken: string): Promise<DocumentType<AuthEntity>>;
  delete(userId: string): Promise<DocumentType<AuthEntity> | null>;
}
