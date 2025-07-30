import { ParamsDictionary } from 'express-serve-static-core';

export type ParamOfferCount = {
  count: number;
} | ParamsDictionary;
