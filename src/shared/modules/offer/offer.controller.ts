import {
  BaseController,
  HttpError,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  HttpMethod, DocumentExistsMiddleware
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
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
import { CommentService, CreateCommentDto } from '../comment/index.js';
import { CreateOfferCommentRequest } from './type/create-offer-comment-request.type.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { CityService } from '../city/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.CityService) private readonly cityService: CityService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.detail,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ],
    });
    this.addRoute({
      path: '/:offerId/comment',
      method: HttpMethod.Get,
      handler: this.comments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ],
    });
    this.addRoute({
      path: '/:offerId/comment',
      method: HttpMethod.Post,
      handler:this.createComment,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ],
    });
    this.addRoute({
      path: '/:cityId/premium',
      method: HttpMethod.Get,
      handler: this.premiumOfferByCity,
      middlewares: [
        new ValidateObjectIdMiddleware('cityId'),
        new DocumentExistsMiddleware(this.cityService, 'City', 'cityId')
      ],
    });
  }

  public async index({ params }: Request<ParamOfferCount>, res: Response) {
    const { count } = params;
    const result = await this.offerService.find(Number(count));
    this.ok(res, fillDTO(OfferRdo, result));
  }

  public async create({ body }: CreateOfferRequestType, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(DetailOfferRdo, result));
  }

  public async update({ params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = params;
    const result = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(DetailOfferRdo, result));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = this.offerService.findById(offerId);

    // TODO из избранных
    // TODO брать userId из токена

    if (offerId) {
      await this.offerService.deleteById(offerId);
      await this.commentService.deleteCommentsByOfferId(offerId);
      this.noContent(res, offer);
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Не указан user id',
        'OfferController'
      );
    }
  }

  public async premiumOfferByCity({ params }: Request<ParamCityPremiumOffers>, res: Response): Promise<void> {
    const result = await this.offerService.findPremiumByCity(params.cityId);
    this.ok(res, fillDTO(OfferRdo, result));
  }

  public async comments({ params }: Request<ParamOfferId>, res: Response) {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async createComment({ body }: CreateOfferCommentRequest, res: Response) {
    const comment = await this.commentService.create(body);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async detail({ params }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId);

    return this.ok(res, fillDTO(DetailOfferRdo, offer));
  }
}
