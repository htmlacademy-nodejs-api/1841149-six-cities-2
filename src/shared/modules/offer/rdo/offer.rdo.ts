import { Expose } from 'class-transformer';

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

  @Expose()
  public rating: number;

  @Expose()
  public typeId: string;

  @Expose()
  public price: number;

  @Expose()
  public authorId: string;

  @Expose()
  public commentsCount: number;
}
