import { CITIES, Sorting, UserType } from '../const';
import {TypeDto} from '../dto/type/type.dto';

export type CityName = typeof CITIES[number];
export type SortName = keyof typeof Sorting;

export type Location = {
  latitude: number;
  longitude: number;
};

export type City = {
  id: string;
  name: CityName;
  location: Location;
};

export type User = {
  name: string;
  avatarUrl: string;
  type: UserType;
  email: string;
};

export type Comment = {
  id: string;
  comment: string;
  date: string;
  rating: number;
  user: User;
};

export type Offer = {
  id: string;
  price: number;
  rating: number;
  title: string;
  isPremium: boolean;
  isFavorite: boolean;
  city: CityName;
  previewImage: string;
  type: TypeDto;
};

export type DetailOffer = {
  id: string;
  title: string;
  description: string;
  city: City;
  previewImage: string;
  isPremium: boolean;
  type: TypeDto;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  location: Location;
  images: string[];
  host: User;
  isFavorite: boolean;
  rating: number;
}

export type NewOffer = {
  title: string;
  description: string;
  city: City;
  previewImage: Blob;
  isPremium: boolean;
  type: string | TypeDto | null;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  location: Location;
  images: Blob[];
};

export type NewComment = Pick<Comment, 'comment' | 'rating'>;
export type UserAuth = Pick<User, 'email'> & { password: string };
export type CommentAuth = NewComment &
  Pick<Offer, 'id'>;
export type FavoriteAuth = Offer['id'];
export type UserRegister = Omit<User, 'avatarUrl'> &
  Pick<UserAuth, 'password'> & { avatar?: File };
