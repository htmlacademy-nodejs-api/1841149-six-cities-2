import { Response, Router } from 'express';
import { Logger } from '../../logger/index.js';
import { DEFAULT_CONTENT_TYPE } from './controller.constants.js';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller } from './controller.interface.js';
import expressAsyncHandler from 'express-async-handler';
import { Route } from '../types/route.interface.js';
import { Component } from '../../../types/index.js';
import { PathTransformer } from '../transform/path-transformer.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  @inject(Component.PathTransformer)
  private pathTransformer: PathTransformer;

  constructor(
    protected readonly logger: Logger
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    const wrapperAsyncHandler = expressAsyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (middleware) => expressAsyncHandler(middleware.execute.bind(middleware)));
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
