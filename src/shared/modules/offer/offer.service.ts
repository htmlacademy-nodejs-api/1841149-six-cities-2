import { OfferService } from './offer-service.interface.js';
import {Component, SortType} from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_COUNT } from './offer.constants.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.TypeModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Created offer "${result.name}"`);
    return result;
  }

  public async findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .aggregate([
        {
          $lookup: {
            from: 'favorites',
            let: { offerId: '$_id', userId: userId },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', '$$userId'] },
                      { $in: ['$$offerId', '$offerIds'] }
                    ]
                  }
                }
              }
            ],
            as: 'favoriteMatch'
          }
        },
        {
          $addFields: {
            isFavorite: { $gt: [{ $size: '$favoriteMatch' }, 0] }
          }
        },
        { $unset: 'favoriteMatch' },
      ])
      .populate(['typeId', 'authorId', 'facilities', 'coordinatesId'])
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .limit(count ? count : DEFAULT_OFFER_COUNT)
      .populate(['typeId', 'authorId', 'facilities', 'coordinatesId'])
      .exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(id)
      .exec();
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate(['typeId', 'authorId', 'facilities', 'coordinatesId'])
      .exec();
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: city}, {})
      .sort({ publishData: SortType.Down })
      .limit(DEFAULT_PREMIUM_COUNT)
      .populate(['typeId', 'authorId', 'facilities', 'coordinatesId'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1
      }
      }).exec();
  }

  public async calculateRating(offerId: string): Promise<void> {
    await this.offerModel
      .aggregate([
        {
          $match: { _id: offerId }
        },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id'},
            pipeline: [
              {
                $match: { $expr: { $eq: ['$$offerId', '$offerId'] } }
              }
            ],
            as: 'comments'
          }
        },
        {
          $addFields: {
            ratings: {
              $map: {
                input: '$comments',
                as: 'comment',
                in: '$$comment.rating'
              }
            }
          }
        },
        {
          $addFields: {
            rating: { $avg: '$ratings' }
          }
        },
        { $unset: ['comments', 'ratings'] },
      ])
      .exec();
  }
}
