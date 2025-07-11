import { ParamsDictionary } from 'express-serve-static-core';

export type ParamAddFavoriteRequest = {
  offerId: string;
} | ParamsDictionary;
