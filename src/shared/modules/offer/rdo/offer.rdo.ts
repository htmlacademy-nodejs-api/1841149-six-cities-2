import { Expose, Type } from 'class-transformer';
import { CityRdo } from '../../city/index.js';
import { TypeRdo } from '../../type/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public publishDate: string;

  @Expose({ name: 'cityId' })
  @Type(() => CityRdo)
  public city: CityRdo;

  @Expose()
  public imagePreview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose({ name: 'typeId' })
  @Type(() => TypeRdo)
  public type: TypeRdo;

  @Expose()
  public price: number;

  @Expose()
  public commentCount: number;

  @Expose()
  public rating: number;
}
