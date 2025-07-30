import store from '../store';

import type {Offer, Comment, City, SortName, User, DetailOffer} from './types';
import { AuthorizationStatus, SubmitStatus } from '../const';
import {TypeDto} from '../dto/type/type.dto';
import {FacilityDto} from '../dto/facility/facility.dto';
import {CityDto} from '../dto/city/city.dto';


export type SiteData = {
    offers: Offer[];
    detailOffer: DetailOffer | null;
    isOffersLoading: boolean;
    offer: Offer | null;
    types: TypeDto[] | null;
    facilities: FacilityDto[] | null;
    cities: CityDto[] | null;
    isOfferLoading: boolean;
    isTypesLoading: boolean;
    isFacilitiesLoading: boolean;
    isCitiesLoading: boolean;
    favoriteOffers: Offer[];
    isFavoriteOffersLoading: boolean;
    premiumOffers: Offer[];
    comments: Comment[];
    commentStatus: SubmitStatus;
};

export type SiteProcess = {
    city: City;
    sorting: SortName;
}

export type UserProcess = {
    authorizationStatus: AuthorizationStatus;
    user: User['email'];
}

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
