import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Coordinates } from '../../types/index.js';
import { FacilityEntity } from '../facility/index.js';
import { UserEntity } from '../user/index.js';
import { TypeEntity } from '../type/index.js';
import { CityEntity } from '../city/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity {
  @prop({ required: true, minlength: 10, maxlength: 100 })
  public name: string;

  @prop({ required: true, minlength: 20, maxlength: 100 })
  public description: string;

  @prop({ required: true })
  public publishDate: Date;

  @prop({
    required: true,
    ref: () => CityEntity,
  })
  public cityId!: Ref<CityEntity>;

  @prop({ required: true })
  public imagePreview: string;

  @prop({ required: true })
  public photos: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ default: false })
  public isFavorite: boolean;

  @prop({ default: 0 })
  public rating: number;

  @prop({
    required: true,
    ref: () => TypeEntity,
  })
  public typeId!: Ref<TypeEntity>;

  @prop({ required: true, min: 1, max: 8 })
  public roomNumber: number;

  @prop({ required: true, min: 1, max: 10 })
  public guestNumber: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price: number;

  @prop({
    required: true,
    ref: () => FacilityEntity,
  })
  public facilities: Ref<FacilityEntity>[];

  @prop({
    required: true,
    ref: UserEntity
  })
  public authorId: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentCount!: number;

  @prop({
    required: true,
  })
  public coordinates: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
