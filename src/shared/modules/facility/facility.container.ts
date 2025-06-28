import { Container } from 'inversify';
import { FacilityService } from './facility-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultFacilityService } from './facility.service.js';
import { types } from '@typegoose/typegoose';
import { FacilityEntity, FacilityModel } from './facility.entity.js';
import { Controller } from '../../libs/rest/index.js';
import { FacilityController } from './facility.controller.js';

export function createFacilityContainer() {
  const facilityContainer = new Container();

  facilityContainer.bind<FacilityService>(Component.FacilityService).to(DefaultFacilityService);
  facilityContainer.bind<types.ModelType<FacilityEntity>>(Component.FacilityModel).toConstantValue(FacilityModel);
  facilityContainer.bind<Controller>(Component.FacilityController).to(FacilityController).inSingletonScope();

  return facilityContainer;
}
