import {
  BaseController,
  PrivateRouteMiddleware,
  UploadFileMiddleware, ValidateAccessTokenMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpMethod } from '../../../rest/index.js';
import { Request, Response } from 'express';
import { Config, RestSchema } from '../../libs/config/index.js';
import { AuthService } from '../auth/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateAccessTokenMiddleware(this.authService),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')]
    });
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
