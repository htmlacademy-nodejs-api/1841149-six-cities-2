import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { AuthService } from './auth-service.interface.js';
import { CreateUserDto, LoggedUserRdo, UserEntity, UserService } from '../user/index.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { CreateUserRequestType } from '../user/type/create-user-request.type.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from '../user/rdo/user.rdo.js';
import { LoginUserRequestType } from '../user/type/login-user-request.type.js';
import { RefreshUserRequestType } from '../user/type/refresh-user-request.type.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { ValidateAccessTokenMiddleware } from '../../libs/rest/middleware/validate-access-token.middleware.js';

@injectable()
export class AuthController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for AuthController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Get,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateAccessTokenMiddleware(authService)
      ]
    });
    this.addRoute({
      path: '/status',
      method: HttpMethod.Get,
      handler: this.status,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateAccessTokenMiddleware(authService)
      ]
    });
    this.addRoute({
      path: '/refresh',
      method: HttpMethod.Post,
      handler: this.refresh,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateAccessTokenMiddleware(authService)
      ]
    });
  }

  public async create({ body }: CreateUserRequestType, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Email или пароль неверный',
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequestType, res: Response): Promise<void> {
    const user = await this.verify(body);
    const tokens = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    this.ok(res, responseData);
  }

  public async status({ tokenPayload: { email } }: Request, res: Response): Promise<void> {
    const existedUser = await this.userService.findByEmail(email);

    if (!existedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'AuthController'
      );
    }

    return this.ok(res, fillDTO(UserRdo, existedUser));
  }

  public async refresh({ tokenPayload, body }: RefreshUserRequestType, res: Response): Promise<void> {
    const user = await this.userService.findById(tokenPayload.id);

    if (user) {
      const updatedUser = await this.authService.update(user, body.refreshToken);
      const responseData = {
        email: user.email,
        accessToken: updatedUser.accessToken,
        refreshToken: updatedUser.refreshToken,
      };

      this.ok(res, responseData);
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Ошибка',
        'UserController'
      );
    }
  }

  public async logout({ tokenPayload }: Request, res: Response): Promise<void> {
    const existedAuth = await this.authService.findByUserId(tokenPayload.id);

    if (existedAuth) {
      const deleted = await this.authService.delete(tokenPayload.id);
      this.noContent(res, deleted);
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Ошибка',
        'UserController'
      );
    }
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.configService.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
