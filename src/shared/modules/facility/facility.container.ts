import { Container } from 'inversify';
import { FacilityService } from './facility-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultFacilityService } from './facility.service.js';
import { types } from '@typegoose/typegoose';
import { FacilityEntity, FacilityModel } from './facility.entity.js';

export function createFacilityContainer() {
  const facilityContainer = new Container();

  facilityContainer.bind<FacilityService>(Component.FacilityService).to(DefaultFacilityService);
  facilityContainer.bind<types.ModelType<FacilityEntity>>(Component.FacilityModel).toConstantValue(FacilityModel);

  return facilityContainer;
}
