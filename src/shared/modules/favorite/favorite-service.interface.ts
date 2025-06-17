import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>[]>;
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  deleteByUserIdAndOfferId(userId: string, offerId: string): Promise<number | null>;
  updateByUserIdOrCreate(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity>>;
}
