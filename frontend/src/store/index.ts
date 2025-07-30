import { configureStore } from '@reduxjs/toolkit';

import { createAPI } from '../api';
import { rootReducer } from './root-reducer';
import {fetchOffers, fetchFavoriteOffers, fetchUserStatus, fetchTypes, fetchFacilities, fetchCities} from './action';
import history from '../history';

const api = createAPI();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        api,
        history
      },
    },
  }),
});

store.dispatch(fetchUserStatus());
store.dispatch(fetchOffers());
store.dispatch(fetchFavoriteOffers());
store.dispatch(fetchTypes());
store.dispatch(fetchFacilities());
store.dispatch(fetchCities());

export default store;
