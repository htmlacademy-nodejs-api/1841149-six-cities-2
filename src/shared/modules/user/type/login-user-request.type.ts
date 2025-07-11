import { Request } from 'express';
import { RequestParams, RequestBody } from '../../../libs/rest/index.js';
import { LoginUserDto } from '../dto/login-user.dto.js';

export type LoginUserRequestType = Request<RequestParams, RequestBody, LoginUserDto>
