import { inject, injectable } from 'inversify';
import {
  BaseController, DocumentExistsMiddleware,
  PrivateRouteMiddleware, ValidateAccessTokenMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { HttpMethod } from '../../../rest/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { FavoriteRdo } from './rdo/favorite.rdo.js';
import { OfferService } from '../offer/index.js';
import { ParamOfferId } from './types/param-offer-id.type.js';
import { ParamAddFavoriteRequest } from './types/param-add-favorite-request.type.js';
import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { AuthService } from '../auth/index.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateAccessTokenMiddleware(this.authService)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.add,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateAccessTokenMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateAccessTokenMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index({ tokenPayload }: Request, res: Response) {
    const result = await this.favoriteService.findByUserId(tokenPayload.id);
    this.ok(res, fillDTO(FavoriteRdo, result));
  }

  public async add({ params, tokenPayload }: Request<ParamAddFavoriteRequest>, res: Response) {
    const { offerId } = params;
    let result: DocumentType<FavoriteEntity> | null = null;
    const existedFavorite = await this.favoriteService.findByUserId(tokenPayload.id);

    if (!existedFavorite) {
      result = await this.favoriteService.create({ offerId, userId: tokenPayload.id });
    } else {
      result = await this.favoriteService.updateByUserIdOrCreate(tokenPayload.id, offerId);
    }

    this.ok(res, fillDTO(FavoriteRdo, result));
  }

  public async delete({ params, tokenPayload }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const result = await this.favoriteService.deleteByUserIdAndOfferId(tokenPayload.id, offerId);

    this.ok(res, fillDTO(FavoriteRdo, result));
  }
}
