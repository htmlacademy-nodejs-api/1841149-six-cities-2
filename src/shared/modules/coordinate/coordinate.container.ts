import { Container } from 'inversify';
import { CoordinateService } from './coordinate-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultCoordinateService } from './coordinate.service.js';
import { types } from '@typegoose/typegoose';
import { CoordinateEntity, CoordinateModel } from './coordinate.entity.js';

export function createCoordinateContainer() {
  const facilityContainer = new Container();

  facilityContainer.bind<CoordinateService>(Component.CoordinateService).to(DefaultCoordinateService);
  facilityContainer.bind<types.ModelType<CoordinateEntity>>(Component.CoordinateModel).toConstantValue(CoordinateModel);

  return facilityContainer;
}
