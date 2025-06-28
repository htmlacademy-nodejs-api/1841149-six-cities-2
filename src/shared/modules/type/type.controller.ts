import { BaseController, HttpMethod } from '../../../rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { TypeService } from './type-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { TypeRdo } from './rdo/type.rdo.js';

@injectable()
export class TypeController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.TypeService) private readonly typeService: TypeService
  ) {
    super(logger);

    this.logger.info('Register routes for TypeController…');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const types = await this.typeService.find();
    this.ok(res, fillDTO(TypeRdo, types));
  }
}
