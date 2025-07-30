import { CityDto } from '../city/city.dto';
import { FacilityDto } from '../facility/facility.dto';
import { UserDto } from '../user/user.dto';
import { CoordinatesDto } from '../coordinates/coordinates.dto';
import {TypeDto} from '../type/type.dto';

export interface OfferDetailDto {
  id: string;
  name: string;
  description: string;
  publishDate: string;
  city: CityDto;
  imagePreview: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  roomNumber: number;
  guestNumber: number;
  facilities: FacilityDto[];
  user: UserDto;
  type: TypeDto;
  price: number;
  commentCount: number;
  coordinates: CoordinatesDto;
}
