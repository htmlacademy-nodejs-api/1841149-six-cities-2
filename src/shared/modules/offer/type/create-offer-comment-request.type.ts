import { Request } from 'express';
import { RequestParams, RequestBody } from '../../../libs/rest/index.js';
import { CreateCommentDto } from '../../comment/index.js';


export type CreateOfferCommentRequest = Request<RequestParams, RequestBody, CreateCommentDto>;
