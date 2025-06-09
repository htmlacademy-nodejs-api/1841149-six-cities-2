import { Container } from 'inversify';
import { TypeService } from './type-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultTypeService } from './type.service.js';
import { types } from '@typegoose/typegoose';
import { TypeEntity, TypeModel } from './type.entity.js';

export function createTypeContainer() {
  const typeContainer = new Container();

  typeContainer.bind<TypeService>(Component.TypeService).to(DefaultTypeService);
  typeContainer.bind<types.ModelType<TypeEntity>>(Component.TypeModel).toConstantValue(TypeModel);

  return typeContainer;
}
