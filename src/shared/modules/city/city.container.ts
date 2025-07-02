import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { CityEntity, CityModel } from './city.entity.js';
import { DefaultCityService } from './city.service.js';
import { CityService } from './city-service.interface.js';

export function createCityContainer() {
  const typeContainer = new Container();

  typeContainer.bind<CityService>(Component.CityService).to(DefaultCityService);
  typeContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);

  return typeContainer;
}
