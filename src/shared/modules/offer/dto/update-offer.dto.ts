export class UpdateOfferDto {
  public name?: string;
  public description?: string;
  public publishDate?: Date;
  public city?: string;
  public imagePreview?: string;
  public photos?: string[];
  public isPremium?: boolean;
  public type?: string;
  public roomNumber?: number;
  public guestNumber?: number;
  public price?: number;
  public facilities?: string[];
}
