import { IsMongoId } from 'class-validator';
import { CreateFavoriteMessage } from './create-favorite.messages.js';

export class CreateFavoriteDto {
  @IsMongoId({ message: CreateFavoriteMessage.userId.invalidFormat })
  public userId: string;

  @IsMongoId({ message: CreateFavoriteMessage.offerId.invalidFormat })
  public offerId: string;
}
