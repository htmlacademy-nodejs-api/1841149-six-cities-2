import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

export type CreateFavoriteRequest = Request<RequestParams, RequestBody, CreateFavoriteDto>;
