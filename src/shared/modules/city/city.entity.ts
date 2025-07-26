import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Coordinates } from '../../types/index.js';
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity {
  @prop({ required: true })
  public name: string;

  @prop({
    required: true,
  })
  public location: Coordinates;
}

export const CityModel = getModelForClass(CityEntity);
