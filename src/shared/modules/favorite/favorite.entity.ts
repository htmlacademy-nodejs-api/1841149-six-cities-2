import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites',
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FavoriteEntity {
  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerIds: Ref<OfferEntity>[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId: Ref<UserEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
