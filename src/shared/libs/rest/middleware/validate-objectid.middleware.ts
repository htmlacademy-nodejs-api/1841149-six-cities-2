import { Middleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {
    console.log('constructor', param);
  }

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    console.log(params, this.param);

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is not a valid ObjectId.`,
      'ValidateObjectIdMiddleware'
    );
  }
}
