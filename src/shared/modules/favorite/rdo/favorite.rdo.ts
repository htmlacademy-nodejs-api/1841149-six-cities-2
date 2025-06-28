import { Expose } from 'class-transformer';

export class FavoriteRdo {
  @Expose()
  public id: string;

  @Expose()
  public offerIds: string;
}
