import {
  BaseController,
  HttpError,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpMethod } from '../../../rest/index.js';
import { Request, Response } from 'express';
import { LoginUserRequestType } from './login-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { CreateUserRequestType } from './create-user-request.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

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
    this.addRoute({ path: '/logout', method: HttpMethod.Get, handler: this.logout });
    this.addRoute({ path: '/status', method: HttpMethod.Get, handler: this.status });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')]
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

  public async login({ body }: LoginUserRequestType, _res: Response): Promise<void> {
    const existedUser = await this.userService.findByEmail(body.email);

    // TODO добавление JWT токена

    if (!existedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Email or password are incorrect',
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async logout(): Promise<void> {
    // TODO
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async status(): Promise<void> {
    // TODO
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
