interface CoordinatesDto {
  latitude: number;
  longitude: number;
}

export interface EditOfferDto {
  id: string;
  name: string;
  description: string;
  publishDate: Date;
  cityId: string;
  isPremium: boolean;
  typeId: string;
  roomNumber: number;
  guestNumber: number;
  price: number;
  facilities: string[];
  coordinates: CoordinatesDto;
}
