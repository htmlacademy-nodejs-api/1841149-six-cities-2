import { Component } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { FavoriteService } from './favorite-service.interface.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>[]> {
    const favorite = await this.favoriteModel.create(dto);
    this.logger.info(`Created ${favorite.id}`);
    return favorite.populate(['offerIds']);
  }

  public async findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel.find({ userId }).populate({
      path: 'offerIds',
      populate: {
        path: 'typeId'
      }
    }).exec();
  }

  public async deleteByUserIdAndOfferId(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity>[] | []> {
    let result: DocumentType<FavoriteEntity>[] = [];
    const isDeleted = await this.favoriteModel.deleteOne(
      { userId: new Types.ObjectId(userId) },
      {
        $pull: {
          offerIds: new Types.ObjectId(offerId)
        }
      }
    );

    if (isDeleted.deletedCount) {
      result = await this.findByUserId(userId);
    }

    return result;
  }

  public async updateByUserIdOrCreate(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity>> {
    const userObjectId = new Types.ObjectId(userId);
    const offerObjectId = new Types.ObjectId(offerId);

    const updatedFavorite = await this.favoriteModel.findOneAndUpdate(
      { userId: userObjectId },
      {
        $addToSet: { offerIds: offerObjectId }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return updatedFavorite;
  }
}
