import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { CityService } from './city-service.interface.js';
import { CityRdo } from './rdo/city.rdo.js';
import { CreateCityRequest } from './types/create-city-request.type.js';

@injectable()
export class CityController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CityService) private readonly cityService: CityService
  ) {
    super(logger);

    this.logger.info('Register routes for CityController…');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();
    this.ok(res, fillDTO(CityRdo, cities));
  }

  public async create({ body }: CreateCityRequest, res: Response): Promise<void> {
    const city = await this.cityService.create(body);
    this.created(res, fillDTO(CityRdo, city));
  }
}
