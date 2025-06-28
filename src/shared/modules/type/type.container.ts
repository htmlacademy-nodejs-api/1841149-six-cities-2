import { Container } from 'inversify';
import { TypeService } from './type-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultTypeService } from './type.service.js';
import { types } from '@typegoose/typegoose';
import { TypeEntity, TypeModel } from './type.entity.js';
import { Controller } from '../../../rest/index.js';
import { TypeController } from './type.controller.js';

export function createTypeContainer() {
  const typeContainer = new Container();

  typeContainer.bind<TypeService>(Component.TypeService).to(DefaultTypeService);
  typeContainer.bind<types.ModelType<TypeEntity>>(Component.TypeModel).toConstantValue(TypeModel);
  typeContainer.bind<Controller>(Component.TypeController).to(TypeController).inSingletonScope();

  return typeContainer;
}
