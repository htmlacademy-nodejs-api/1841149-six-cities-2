import { Request } from 'express';
import { RequestParams, RequestBody } from '../../../libs/rest/index.js';
import { CreateCityDto } from '../dto/create-city.dto.js';

export type CreateCityRequest = Request<RequestParams, RequestBody, CreateCityDto>
