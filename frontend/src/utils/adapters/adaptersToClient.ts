import {OfferDto} from '../../dto/offer/offer.dto';
import {Comment, DetailOffer, Offer} from '../../types/types';
import {OfferDetailDto} from '../../dto/offer/detail-offer.dto';
import {UserType} from '../../const';
import {CommentDto} from '../../dto/comment/comment.dto';

export const adaptOffersToClient = (offers: OfferDto[]): Offer[] =>
  offers.map((offer: OfferDto) => ({
    id: offer.id,
    price: offer.price,
    title: offer.name,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    previewImage: offer.imagePreview,
    type: offer.type,
    rating: offer.rating,
    city: offer.city?.name ?? '',
  }));

export const adaptDetailOfferToClient = (offer: OfferDetailDto): DetailOffer => ({
  id: offer.id,
  title: offer.name,
  description: offer.description,
  city: {
    id: offer.city.id,
    name: offer.city.name,
    location: {
      latitude: 50,
      longitude: 50
    }
  },
  previewImage: offer.imagePreview,
  isPremium: offer.isPremium,
  type: offer.type,
  bedrooms: offer.roomNumber,
  maxAdults: offer.guestNumber,
  price: offer.price,
  goods: offer.facilities.map((el) => el.name),
  location: offer.coordinates,
  images: offer.photos,
  host: {
    name: offer.user.name,
    avatarUrl: offer.user.avatar,
    type: offer.user.userType === 'pro' ? UserType.Pro : UserType.Regular,
    email: offer.user.email
  },
  isFavorite: offer.isFavorite,
  rating: offer.rating,
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map((el) => ({
    id: el.id,
    comment: el.text,
    date: el.createdAt,
    rating: el.rating,
    user: {
      name: el.user.name,
      avatarUrl: el.user.avatar,
      type: el.user.userType === 'pro' ? UserType.Pro : UserType.Regular,
      email: el.user.email
    }
  }));

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.createdAt,
  rating: comment.rating,
  user: {
    name: comment.user.name,
    avatarUrl: comment.user.avatar,
    type: comment.user.userType === 'pro' ? UserType.Pro : UserType.Regular,
    email: comment.user.email
  }
});
