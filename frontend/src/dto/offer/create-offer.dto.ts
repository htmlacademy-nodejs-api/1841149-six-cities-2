import {TypeDto} from '../type/type.dto';

interface CoordinatesDto {
  latitude: number;
  longitude: number;
}

export interface CreateOfferDto {
  name: string;
  description: string;
  publishDate: Date;
  cityId: string;
  isPremium: boolean;
  typeId: string | TypeDto | null;
  roomNumber: number;
  guestNumber: number;
  price: number;
  facilities: string[];
  coordinates: CoordinatesDto;
}
