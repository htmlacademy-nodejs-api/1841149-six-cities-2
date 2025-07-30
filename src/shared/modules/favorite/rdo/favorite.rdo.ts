import { Expose, Type, Transform } from 'class-transformer';
import { OfferRdo } from '../../offer/rdo/offer.rdo.js';

export class FavoriteRdo {
  @Expose({ name: 'offerIds' })
  @Type(() => OfferRdo)
  @Transform(({ value }) => value)
  public offers: OfferRdo[];
}
