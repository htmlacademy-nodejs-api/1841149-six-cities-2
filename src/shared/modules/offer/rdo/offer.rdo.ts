import { Expose, Type } from 'class-transformer';
import { CityRdo } from '../../city/index.js';
import { TypeRdo } from '../../type/index.js';
import { FacilityRdo } from '../../facility/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { Coordinates } from '../../../types/index.js';

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

  @Expose()
  public roomNumber: number;

  @Expose()
  public guestNumber: number;

  @Expose({ name: 'facilities' })
  @Type(() => FacilityRdo)
  public facilities: FacilityRdo[];

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public photos: string;

  @Expose()
  public coordinates: Coordinates;

  @Expose()
  public description: string;
}
