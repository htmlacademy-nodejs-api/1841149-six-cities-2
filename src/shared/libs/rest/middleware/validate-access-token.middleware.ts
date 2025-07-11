import { Middleware } from './middleware.interface.js';
import { AuthService } from '../../../modules/auth/index.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../../types/index.js';
import { inject } from 'inversify';

export class ValidateAccessTokenMiddleware implements Middleware {
  constructor(
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authorization header missing',
        'ValidateAccessTokenMiddleware',
      ));
    }

    const [, token] = authorizationHeader;

    if (!token) {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Token missing',
        'ValidateAccessTokenMiddleware',
      ));
    }

    try {
      const { tokenPayload } = req;

      const authRecord = await this.authService.findByUserId(tokenPayload.id);

      if (!authRecord) {
        return next(new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Invalid token',
          'ValidateAccessTokenMiddleware',
        ));
      }

      if (authRecord.accessToken !== token) {
        return next(new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Invalid token',
          'ValidateAccessTokenMiddleware',
        ));
      }

      return next();
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticationMiddleware',
      ));
    }
  }
}
