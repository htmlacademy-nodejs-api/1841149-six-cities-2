export class CreateOfferDto {
  name: string;
  description: string;
  publishDate: Date;
  city: string;
  imagePreview: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  typeId: string;
  roomNumber: number;
  guestNumber: number;
  price: number;
  facilities: string[];
  authorId: string;
  commentsCount: number;
  coordinatesId: string;
}
