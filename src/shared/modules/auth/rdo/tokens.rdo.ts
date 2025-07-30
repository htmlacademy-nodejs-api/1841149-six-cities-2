import { Expose } from 'class-transformer';

export class TokensRdo {
  @Expose()
  public accessToken: string;

  @Expose()
  public refreshToken: string;
}
