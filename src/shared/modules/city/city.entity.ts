import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
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
}

export const CityModel = getModelForClass(CityEntity);
