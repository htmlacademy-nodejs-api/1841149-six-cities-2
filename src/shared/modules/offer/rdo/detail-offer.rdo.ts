import { Expose, Transform, Type } from 'class-transformer';
import { OfferTypeRdo } from '../../type/rdo/offer-type.rdo.js';
import { FacilityRdo } from '../../facility/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { Coordinates } from '../../../types/index.js';

export class DetailOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose()
  public publishDate: string;

  @Expose()
  public city: string;

  @Expose()
  public imagePreview: string;

  @Expose()
  public photos: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public roomNumber: number;

  @Expose()
  public guestNumber: number;

  @Expose({ name: 'facilities' })
  @Type(() => FacilityRdo)
  @Transform(({ value }) => value.map((item: FacilityRdo) => item?.name))
  public facilities: FacilityRdo[];

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public user: string;

  @Expose({ name: 'typeId' })
  @Type(() => OfferTypeRdo)
  @Transform(({ obj }) => obj.typeId?.name)
  public type: string;

  @Expose()
  public price: number;

  @Expose()
  public commentCount: number;

  @Expose()
  public coordinates: Coordinates;
}
