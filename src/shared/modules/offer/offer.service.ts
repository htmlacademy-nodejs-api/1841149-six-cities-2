import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_COUNT } from './offer.constants.js';
import { Types } from 'mongoose';
import { CityEntity } from '../city/index.js';
import { TypeEntity } from '../type/index.js';
import { FacilityEntity } from '../facility/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>,
    @inject(Component.TypeModel) private readonly typeModel: types.ModelType<TypeEntity>,
    @inject(Component.FacilityModel) private readonly facilityModel: types.ModelType<FacilityEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const foundCity = await this.cityModel.findById(dto.cityId);

    if (!foundCity) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'City not exists', 'OfferService');
    }

    const foundType = await this.typeModel.findById(dto.typeId);

    if (!foundType) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Type not exists', 'OfferService');
    }

    const foundFacilities = await this.facilityModel.find({ _id: { $in: dto.facilities } });

    if (foundFacilities.length !== dto.facilities.length) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Some facilities not exists', 'OfferService');
    }

    const result = await this.offerModel.create(dto);
    this.logger.info(`Created offer "${result.name}"`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['typeId', 'authorId', 'facilities', 'cityId'])
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ publishData: SortType.Down })
      .limit(count ? count : DEFAULT_OFFER_COUNT)
      .populate(['typeId', 'authorId', 'facilities', 'cityId'])
      .exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(id)
      .exec();
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    if (dto.cityId) {
      const foundCity = await this.cityModel.findById(dto.cityId);

      if (!foundCity) {
        throw new HttpError(StatusCodes.BAD_REQUEST, 'City not exists', 'OfferService');
      }
    }

    if (dto.typeId) {
      const foundType = await this.typeModel.findById(dto.typeId);

      if (!foundType) {
        throw new HttpError(StatusCodes.BAD_REQUEST, 'Type not exists', 'OfferService');
      }
    }

    if (dto.facilities) {
      const foundFacilities = this.facilityModel.find({ _id: { $in: dto.facilities } });

      if (foundFacilities.length !== dto.facilities.length) {
        throw new HttpError(StatusCodes.BAD_REQUEST, 'Some facilities not exists', 'OfferService');
      }
    }

    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate(['typeId', 'authorId', 'facilities', 'cityId'])
      .exec();
  }

  public async findPremiumByCity(cityId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ cityId: cityId }, {})
      .sort({ publishData: SortType.Up })
      .limit(DEFAULT_PREMIUM_COUNT)
      .populate(['typeId', 'authorId', 'facilities', 'cityId'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { '$inc': {
        commentCount: 1
      }
      }).exec();
  }

  public async calculateRating(offerId: string): Promise<void> {
    const result = await this.offerModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(offerId) } },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
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

    const calculatedRating = result[0]?.rating.toFixed(1) ?? 0;

    await this.offerModel.findByIdAndUpdate(offerId, {
      '$set': { rating: calculatedRating }
    }).exec();
  }
}
