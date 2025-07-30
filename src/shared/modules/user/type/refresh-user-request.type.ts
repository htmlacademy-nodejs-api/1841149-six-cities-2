import { Request } from 'express';
import { RequestParams, RequestBody } from '../../../libs/rest/index.js';
import { RefreshUserDto } from '../dto/refresh-user.dto.js';

export type RefreshUserRequestType = Request<RequestParams, RequestBody, RefreshUserDto>
