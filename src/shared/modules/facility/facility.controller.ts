import { BaseController, HttpMethod } from '../../../rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { FacilityService } from './facility-service.interface.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { FacilityRdo } from './rdo/facility.rdo.js';

@injectable()
export class FacilityController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FacilityService) private readonly facilityService: FacilityService,
  ) {
    super(logger);

    this.logger.info('Register routes for FacilityController');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const facilities = await this.facilityService.find();
    this.ok(res, fillDTO(FacilityRdo, facilities));
  }
}
