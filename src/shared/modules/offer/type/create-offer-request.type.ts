import { Request } from 'express';
import { RequestParams, RequestBody } from '../../../libs/rest/index.js';
import { CreateOfferDto } from '../dto/create-offer.dto.js';

export type CreateOfferRequestType = Request<RequestParams, RequestBody, CreateOfferDto>;
