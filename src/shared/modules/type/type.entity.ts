import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { RentalOfferType } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface TypeEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'types',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class TypeEntity extends defaultClasses.TimeStamps {
  @prop({
    type: () => String,
    enum: RentalOfferType
  })
  public name!: RentalOfferType;
}

export const TypeModel = getModelForClass(TypeEntity);
