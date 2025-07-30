import {CommentAuth, DetailOffer, NewOffer, UserRegister} from '../../types/types';
import {CreateUserDto} from '../../dto/user/create-user.dto';
import {UserType} from '../../const';
import {UserTypeDto} from '../../dto/user/user-type-dto.enum';
import {CreateCommentDto} from '../../dto/comment/create-comment.dto';
import {CreateOfferDto} from '../../dto/offer/create-offer.dto';
import {EditOfferDto} from '../../dto/offer/edit-offer.dto';

export const adaptSignupToServer = (user: UserRegister): CreateUserDto => ({
  name: user.name,
  email: user.email,
  userType: user.type === UserType.Pro ? UserTypeDto.pro : UserTypeDto.default,
  password: user.password,
});

export const adaptCreateCommentsToServer = (comment: CommentAuth): CreateCommentDto => ({
  text: comment.comment,
  rating: comment.rating,
});

export const adaptCreateOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  name: offer.title,
  description: offer.description,
  publishDate: new Date(),
  cityId: offer.city.id,
  isPremium: offer.isPremium,
  typeId: offer.type,
  roomNumber: offer.bedrooms,
  guestNumber: offer.maxAdults,
  price: offer.price,
  facilities: offer.goods,
  coordinates: offer.location,
});

export const adaptEditOfferToServer = (offer: DetailOffer): EditOfferDto => ({
  id: offer.id,
  name: offer.title,
  description: offer.description,
  publishDate: new Date(),
  cityId: offer.city.id,
  isPremium: offer.isPremium,
  typeId: offer.type.id,
  roomNumber: offer.bedrooms,
  guestNumber: offer.maxAdults,
  price: offer.price,
  facilities: offer.goods,
  coordinates: offer.location,
});
