import { AuthService } from './auth-service.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { Logger } from '../../libs/logger/index.js';
import { UserEntity, UserService } from '../user/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import * as crypto from 'node:crypto';
import { TokenPayload } from './types/TokenPayload.js';
import { SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRED, JWT_REFRESH_EXPIRED } from './auth.constant.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';
import { AuthEntity } from './auth.entity.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { TokensRdo } from './rdo/tokens.rdo.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthModel) private readonly authModel: types.ModelType<AuthEntity>,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  private async createTokens(user: UserEntity): Promise<TokensRdo> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');

    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
      userType: user.userType,
    };

    const refreshTokenPayload = {
      id: user.id,
      type: 'refresh'
    };

    const accessToken = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);

    const refreshToken = await new SignJWT(refreshTokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_REFRESH_EXPIRED)
      .sign(secretKey);

    this.logger.info(`Create tokens for ${user.email}`);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async authenticate(user: UserEntity): Promise<TokensRdo> {
    const existedAuth = await this.findByUserId(user.id);

    if (existedAuth) {
      const updatedAuth = await this.update(user, existedAuth.refreshToken);
      return {
        accessToken: updatedAuth.accessToken,
        refreshToken: updatedAuth.refreshToken,
      };
    } else {
      const tokens = await this.createTokens(user);
      const createdAuth = await this.create({
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
        userId: user.id,
      });
      return {
        accessToken: createdAuth.accessToken,
        refreshToken: createdAuth.refreshToken,
      };
    }
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }

  public async create(dto: CreateAuthDto): Promise<DocumentType<AuthEntity>> {
    return await this.authModel.create(dto);
  }

  public async update(user: UserEntity, refreshToken: string): Promise<DocumentType<AuthEntity>> {
    const tokens = await this.createTokens(user);
    const updatedAuth = await this.authModel.findOneAndUpdate(
      {
        userId: user.id,
        refreshToken: refreshToken,
      },
      {
        $set: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
      { new: true }
    );

    if (!updatedAuth) {
      throw new UserNotFoundException();
    }

    return updatedAuth;
  }

  public async delete(userId: string): Promise<DocumentType<AuthEntity> | null> {
    return await this.authModel.findOneAndDelete({ userId: userId }).exec();
  }

  public async findByUserId(userId: string): Promise<DocumentType<AuthEntity> | null> {
    return this.authModel.findOne({ userId: userId }).exec();
  }
}
