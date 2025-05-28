import { RentalOfferType } from './rental-offer-type.enum.js';
import { FacilityType } from './facility-type.enum.js';
import { Coordinates } from './coordinates.type.js';
import { Author } from './author.type.js';

export type RentalOffer = {
  name: string;
  description: string;
  publishDate: Date;
  city: string;
  imagePreview: string;
  photos: string[];
  isPremium: boolean;
  isFavourite: boolean;
  rating: number;
  type: RentalOfferType;
  roomNumber: number;
  guestNumber: number;
  price: number;
  facilities: FacilityType[];
  author: Author;
  commentsCount: number;
  coordinates: Coordinates;
}
