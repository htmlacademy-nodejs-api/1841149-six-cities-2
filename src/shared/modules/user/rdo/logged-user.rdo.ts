
import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public accessToken: string;

  @Expose()
  public refreshToken: string;

  @Expose()
  public email: string;
}
