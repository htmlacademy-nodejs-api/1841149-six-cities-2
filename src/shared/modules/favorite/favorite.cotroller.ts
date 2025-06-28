import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { HttpMethod } from '../../../rest/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { FavoriteRdo } from './rdo/favorite.rdo.js';
import { CreateFavoriteRequest } from './create-favorite-request.type.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.add });
    this.addRoute({ path: '/', method: HttpMethod.Delete, handler: this.delete });
  }

  public async index(_req: Request, res: Response) {
    const result = await this.favoriteService.findByUserId('68603cbdc63ef51dd5121649');
    this.ok(res, fillDTO(FavoriteRdo, result));
  }

  public async delete({ body }: CreateFavoriteRequest, res: Response) {
    const result = await this.favoriteService.deleteByUserIdAndOfferId(body.userId, body.offerId);

    this.ok(res, result);
  }

  public async add({ body }: CreateFavoriteRequest, res: Response) {
    const result = await this.favoriteService.create(body);

    this.ok(res, fillDTO(FavoriteRdo, result));
  }
}
