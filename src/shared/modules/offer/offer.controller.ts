import { BaseController, HttpError } from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpMethod } from '../../../rest/index.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { ParamOfferCount } from './type/param-offer-count.type.js';
import { CreateOfferRequestType } from './type/create-offer-request.type.js';
import { ParamOfferId } from './type/param-offer-id.type.js';
import { StatusCodes } from 'http-status-codes';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { ParamCityPremiumOffers } from './type/param-city-premium-offers.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

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
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
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

  public async create({ body }: CreateOfferRequestType, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(DetailOfferRdo, result));
  }

  public async update({ params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = params;

    console.log(params);

    if (offerId) {
      const result = await this.offerService.updateById(offerId, body);
      this.ok(res, fillDTO(DetailOfferRdo, result));
    }
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;

    // TODO удаление комментариев и из избранных
    // TODO брать userId из токена

    if (offerId) {
      const offer = await this.offerService.findById(offerId, '68603cbdc63ef51dd51216b6');

      if (offer) {
        const result = await this.offerService.deleteById(offerId);
        this.ok(res, result);
      } else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'Вы пытаетесь удалить чужое предложение',
          'OfferController'
        );
      }

    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Не указан user id',
        'OfferController'
      );
    }
  }

  public async premiumOfferByCity({ params }: Request<ParamCityPremiumOffers>, res: Response): Promise<void> {
    if (params.city) {
      const result = await this.offerService.findPremiumByCity(params.city);
      this.ok(res, fillDTO(OfferRdo, result));
    }
  }

  public async comments() {
    // TODO
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async createComment() {
    // TODO
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async detail({ params }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;

    // TODO брать userId из токена

    if (offerId) {
      const offer = await this.offerService.findById(offerId, '68603cbdc63ef51dd51216b6');
      return this.ok(res, fillDTO(DetailOfferRdo, offer));
    }
  }
}
