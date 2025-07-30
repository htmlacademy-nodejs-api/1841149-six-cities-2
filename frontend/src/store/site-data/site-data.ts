import { createSlice } from '@reduxjs/toolkit';

import type { SiteData } from '../../types/state';
import { StoreSlice, SubmitStatus } from '../../const';
import {
  fetchOffers,
  fetchOffer,
  fetchPremiumOffers,
  fetchComments,
  postComment,
  postFavorite,
  deleteFavorite,
  fetchFavoriteOffers,
  postOffer,
  editOffer,
  fetchTypes,
  fetchFacilities,
  fetchCities
} from '../action';

const initialState: SiteData = {
  offers: [],
  isOffersLoading: false,
  offer: null,
  types: null,
  cities: null,
  facilities: null,
  detailOffer: null,
  isOfferLoading: false,
  isTypesLoading: false,
  isFacilitiesLoading: false,
  isCitiesLoading: false,
  favoriteOffers: [],
  isFavoriteOffersLoading: false,
  premiumOffers: [],
  comments: [],
  commentStatus: SubmitStatus.Still,
};

export const siteData = createSlice({
  name: StoreSlice.SiteData,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isOffersLoading = true;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isOffersLoading = false;
      })
      .addCase(fetchOffers.rejected, (state) => {
        state.isOffersLoading = false;
      })
      .addCase(fetchFavoriteOffers.pending, (state) => {
        state.isFavoriteOffersLoading = true;
      })
      .addCase(fetchFavoriteOffers.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
        state.isFavoriteOffersLoading = false;
      })
      .addCase(fetchFavoriteOffers.rejected, (state) => {
        state.isFavoriteOffersLoading = false;
      })
      .addCase(fetchOffer.pending, (state) => {
        state.isOfferLoading = true;
      })
      .addCase(fetchOffer.fulfilled, (state, action) => {
        state.detailOffer = action.payload;
        state.isOfferLoading = false;
      })
      .addCase(fetchOffer.rejected, (state) => {
        state.isOfferLoading = false;
      })
      .addCase(fetchTypes.pending, (state) => {
        state.isTypesLoading = true;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload;
        state.isTypesLoading = false;
      })
      .addCase(fetchTypes.rejected, (state) => {
        state.isFacilitiesLoading = false;
      })
      .addCase(fetchFacilities.pending, (state) => {
        state.isFacilitiesLoading = true;
      })
      .addCase(fetchFacilities.fulfilled, (state, action) => {
        state.facilities = action.payload;
        state.isTypesLoading = false;
      })
      .addCase(fetchFacilities.rejected, (state) => {
        state.isTypesLoading = false;
      })
      .addCase(fetchCities.pending, (state) => {
        state.isCitiesLoading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.isCitiesLoading = false;
      })
      .addCase(fetchCities.rejected, (state) => {
        state.isCitiesLoading = false;
      })
      .addCase(postOffer.fulfilled, (state, action) => {
        state.offers.push(action.payload);
      })
      .addCase(editOffer.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        state.offers = state.offers.map((offer) => offer.id === updatedOffer.id ? {
          ...offer,
          ...Object.fromEntries(
            Object.entries(updatedOffer).filter(([key]) => key in offer)
          )
        } : offer);
        // state.favoriteOffers = state.favoriteOffers.map((offer) => offer.id === updatedOffer.id ? updatedOffer : offer);
        // state.premiumOffers = state.premiumOffers.map((offer) => offer.id === updatedOffer.id ? updatedOffer : offer);
      })
      .addCase(fetchPremiumOffers.fulfilled, (state, action) => {
        state.premiumOffers = action.payload;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(postComment.pending, (state) => {
        state.commentStatus = SubmitStatus.Pending;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.commentStatus = SubmitStatus.Fullfilled;
      })
      .addCase(postComment.rejected, (state) => {
        state.commentStatus = SubmitStatus.Rejected;
      })
      .addCase(postFavorite.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        state.offers = state.offers.map((offer) => offer.id === updatedOffer.id ? updatedOffer : offer);
        state.premiumOffers = state.premiumOffers.map((offer) => offer.id === updatedOffer.id ? updatedOffer : offer);
        state.favoriteOffers = state.favoriteOffers.concat(updatedOffer);

        if (state.offer && state.offer.id === updatedOffer.id) {
          state.offer = updatedOffer;
        }
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        state.offers = state.offers.map((offer) => offer.id === updatedOffer.id ? updatedOffer : offer);
        state.premiumOffers = state.premiumOffers.map((offer) => offer.id === updatedOffer.id ? updatedOffer : offer);
        state.favoriteOffers = state.favoriteOffers.filter((favoriteOffer) => favoriteOffer.id !== updatedOffer.id);

        if (state.offer && state.offer.id === updatedOffer.id) {
          state.offer = updatedOffer;
        }
      });
  }
});
