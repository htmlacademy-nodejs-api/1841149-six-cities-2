import { Expose, Transform, Type } from 'class-transformer';
import { OfferTypeRdo } from '../../type/rdo/offer-type.rdo.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public publishDate: string;

  @Expose()
  public city: string;

  @Expose()
  public imagePreview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose({ name: 'typeId' })
  @Type(() => OfferTypeRdo)
  @Transform(({ obj }) => obj.typeId?.name)
  public type: string;

  @Expose()
  public price: number;

  @Expose()
  public commentCount: number;
}
