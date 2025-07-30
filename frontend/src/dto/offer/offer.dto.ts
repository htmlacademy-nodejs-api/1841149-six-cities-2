import { CityDto } from '../city/city.dto';
import { TypeDto } from '../type/type.dto';
import { FacilityDto } from '../facility/facility.dto';
import { UserDto } from '../user/user.dto';
import { CoordinatesDto } from '../coordinates/coordinates.dto';

export interface OfferDto {
  id: string;
  name: string;
  publishDate: string;
  city: CityDto;
  imagePreview: string;
  isPremium: boolean;
  isFavorite: boolean;
  type: TypeDto;
  price: number;
  commentCount: number;
  rating: number;
  roomNumber: number;
  guestNumber: number;
  facilities: FacilityDto[];
  user: UserDto;
  photos: string[];
  coordinates: CoordinatesDto;
  description: string;
}
