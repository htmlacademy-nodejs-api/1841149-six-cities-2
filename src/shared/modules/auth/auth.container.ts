import { Container } from 'inversify';
import { AuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultAuthService } from './default-auth.service.js';
import { ExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';
import { types } from '@typegoose/typegoose';
import { AuthEntity, AuthModel } from './auth.entity.js';
import { AuthController } from './auth.controller.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
  authContainer.bind<AuthController>(Component.AuthController).to(AuthController).inSingletonScope();
  authContainer.bind<types.ModelType<AuthEntity>>(Component.AuthModel).toConstantValue(AuthModel);

  return authContainer;
}
