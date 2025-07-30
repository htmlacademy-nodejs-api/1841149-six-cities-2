import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface AuthEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'auth',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class AuthEntity {
  @prop()
  public refreshToken: string;

  @prop()
  public accessToken: string;

  @prop({
    required: true,
    ref: UserEntity
  })
  public userId: Ref<UserEntity>;
}

export const AuthModel = getModelForClass(AuthEntity);
