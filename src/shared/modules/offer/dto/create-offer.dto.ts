export class CreateOfferDto {
  name: string;
  description: string;
  publishDate: Date;
  city: string;
  imagePreview: string;
  photos: string[];
  isPremium: boolean;
  typeId: string;
  roomNumber: number;
  guestNumber: number;
  price: number;
  facilities: string[];
  authorId: string;
  coordinates: {
    latitude: number,
    longitude: number
  };
}
