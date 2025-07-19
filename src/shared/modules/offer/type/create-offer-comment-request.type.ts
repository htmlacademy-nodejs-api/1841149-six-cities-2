import { Request } from 'express';
import { RequestBody } from '../../../libs/rest/index.js';
import { CreateCommentDto } from '../../comment/index.js';
import { ParamOfferId } from './param-offer-id.type.js';


export type CreateOfferCommentRequest = Request<ParamOfferId, RequestBody, CreateCommentDto>;
