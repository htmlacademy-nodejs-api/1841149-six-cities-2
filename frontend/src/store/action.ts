import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  UserAuth,
  User,
  Offer,
  Comment,
  CommentAuth,
  FavoriteAuth,
  UserRegister,
  NewOffer,
  DetailOffer
} from '../types/types';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { Token } from '../utils';
import {OfferDto} from '../dto/offer/offer.dto';
import {
  adaptCommentsToClient,
  adaptCommentToClient,
  adaptDetailOfferToClient,
  adaptOffersToClient
} from '../utils/adapters/adaptersToClient';
import {OfferDetailDto} from '../dto/offer/detail-offer.dto';
import {CommentDto} from '../dto/comment/comment.dto';
import {
  adaptCreateCommentsToServer,
  adaptCreateOfferToServer, adaptEditOfferToServer,
  adaptSignupToServer
} from '../utils/adapters/adaptersToServer';
import {TypeDto} from '../dto/type/type.dto';
import {FacilityDto} from '../dto/facility/facility.dto';
import {CityDto} from '../dto/city/city.dto';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'auth/login',
  LOGOUT_USER: 'auth/logout',
  FETCH_USER_STATUS: 'auth/status',
  REGISTER_USER: 'auth/register',
  FETCH_FACILITIES: '/facilities',
  FETCH_TYPES: '/types',
  FETCH_CITIES: '/cities',
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(ApiRoute.Offers);

    return adaptOffersToClient(data);
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(ApiRoute.Favorite);
    return adaptOffersToClient(data);
  });

export const fetchOffer = createAsyncThunk<DetailOffer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDetailDto>(`${ApiRoute.Offers}/${id}`);

      return adaptDetailOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<Offer>(ApiRoute.Offers, adaptCreateOfferToServer(newOffer));

    if (data) {
      const payload = new FormData();
      payload.append('imagePreview', newOffer.previewImage);
      await api.post(`offers/${data.id}${ApiRoute.OFFER_PREVIEW}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      const payload2 = new FormData();
      newOffer.images.forEach((blob) => {
        payload2.append('photos', blob);
      });

      await api.post(`offers/${data.id}${ApiRoute.OFFER_PHOTOS}`, payload2, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
    }

    history.push(`${AppRoute.Property}/${data.id}`);

    return data;
  });

export const editOffer = createAsyncThunk<DetailOffer, DetailOffer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.patch<DetailOffer>(`${ApiRoute.Offers}/${offer.id}`, adaptEditOfferToServer(offer));

    if (offer?.previewImage) {
      const payload = new FormData();
      payload.append('imagePreview', offer.previewImage);
      await api.post(`offers/${data.id}${ApiRoute.OFFER_PREVIEW}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
    }

    if (offer?.images) {
      const payload2 = new FormData();
      offer.images.forEach((blob) => {
        payload2.append('photos', blob);
      });

      await api.post(`offers/${data.id}${ApiRoute.OFFER_PHOTOS}`, payload2, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
    }

    history.push(`${AppRoute.Property}/${data.id}`);

    return data;
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityId, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(`${ApiRoute.Offers}/${cityId}${ApiRoute.Premium}`);

    return adaptOffersToClient(data);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDto[]>(`${ApiRoute.Offers}/${id}${ApiRoute.Comments}`);

    return adaptCommentsToClient(data);
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<User>(ApiRoute.Status);

      return data.email;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<User & { accessToken: string }>(ApiRoute.Login, { email, password });
    const { accessToken } = data;

    Token.save(accessToken);
    history.push(AppRoute.Root);

    return email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    const { api } = extra;
    await api.get(ApiRoute.Logout);

    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async (registerUserData, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<{ id: string }>(ApiRoute.Register, adaptSignupToServer(registerUserData));
    if (registerUserData.avatar) {
      const payload = new FormData();
      payload.append('avatar', registerUserData.avatar);
      await api.post(`user/${data.id}${ApiRoute.Avatar}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
    }
    history.push(AppRoute.Login);
  });

export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async (comment, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<CommentDto>(`${ApiRoute.Offers}/${comment.id}${ApiRoute.Comments}`, adaptCreateCommentsToServer(comment));

    return adaptCommentToClient(data);
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<Offer>(
      `${ApiRoute.Favorite}/${id}`
    );

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.delete<Offer>(
      `${ApiRoute.Favorite}/${id}`
    );

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const fetchTypes = createAsyncThunk<TypeDto[], undefined, { extra: Extra }>(
  Action.FETCH_TYPES, async (_, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<TypeDto[]>(
        `${ApiRoute.Types}`
      );

      return data;
    } catch (error) {

      return Promise.reject(error);
    }
  }
);

export const fetchFacilities = createAsyncThunk<FacilityDto[], undefined, { extra: Extra }>(
  Action.FETCH_FACILITIES, async (_, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<FacilityDto[]>(
        `${ApiRoute.Facilities}`
      );

      return data;
    } catch (error) {

      return Promise.reject(error);
    }
  }
);

export const fetchCities = createAsyncThunk<CityDto[], undefined, { extra: Extra }>(
  Action.FETCH_CITIES, async (_, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<CityDto[]>(
        `${ApiRoute.Cities}`
      );

      return data;
    } catch (error) {

      return Promise.reject(error);
    }
  }
);
