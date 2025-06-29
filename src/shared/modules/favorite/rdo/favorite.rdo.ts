import { Expose, Type } from 'class-transformer';
import { OfferRdo } from '../../offer/rdo/offer.rdo.js';

export class FavoriteRdo {
  @Expose({ name: 'offerIds' })
  @Type(() => OfferRdo)
  public offers: OfferRdo[];
}
