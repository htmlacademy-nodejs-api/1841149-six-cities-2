export class UpdateOfferDto {
  public name?: string;
  public description?: string;
  public publishDate?: Date;
  public cityId?: string;
  public imagePreview?: string;
  public photos?: string[];
  public isPremium?: boolean;
  public typeId?: string;
  public roomNumber?: number;
  public guestNumber?: number;
  public price?: number;
  public facilities?: string[];
}
