import { BaseController } from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpMethod } from '../../../rest/index.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { ParamOfferCount } from './type/param-offer-count.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.detail });
    this.addRoute({ path: '/:offerId/comment', method: HttpMethod.Get, handler: this.comments });
    this.addRoute({ path: '/:offerId/comment', method: HttpMethod.Post, handler: this.createComment });
    this.addRoute({ path: '/:city/premium', method: HttpMethod.Get, handler: this.premiumOfferByCity });
  }

  public async index({ params }: Request<ParamOfferCount>, res: Response) {
    const { count } = params;
    const result = await this.offerService.find(count);
    this.ok(res, fillDTO(OfferRdo, result));
  }

  public async create() {}

  public async update() {}

  public async delete() {}

  public async premiumOfferByCity() {}

  public async comments() {}

  public async createComment() {}

  public detail() {}
}
