import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { CityEntity, CityModel } from './city.entity.js';
import { DefaultCityService } from './city.service.js';
import { CityService } from './city-service.interface.js';
import { Controller } from '../../libs/rest/index.js';
import { CityController } from './city.controller.js';

export function createCityContainer() {
  const cityContainer = new Container();

  cityContainer.bind<CityService>(Component.CityService).to(DefaultCityService);
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
  cityContainer.bind<Controller>(Component.CityController).to(CityController).inSingletonScope();

  return cityContainer;
}
