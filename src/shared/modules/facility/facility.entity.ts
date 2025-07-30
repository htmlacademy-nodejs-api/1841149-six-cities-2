import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { FacilityType } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FacilityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'facilities',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FacilityEntity extends defaultClasses.TimeStamps {
  @prop({
    type: () => String,
    enum: FacilityType
  })
  public name!: FacilityType;
}

export const FacilityModel = getModelForClass(FacilityEntity);
