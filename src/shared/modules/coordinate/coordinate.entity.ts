import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CoordinateEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'coordinates',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CoordinateEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public longitude: number;

  @prop({ required: true })
  public latitude: number;
}

export const CoordinateModel = getModelForClass(CoordinateEntity);
