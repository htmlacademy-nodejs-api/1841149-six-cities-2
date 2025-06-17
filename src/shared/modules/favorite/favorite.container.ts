import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { FavoriteEntity, FavoriteModel, DefaultFavoriteService } from './index.js';
import { FavoriteService } from './favorite-service.interface.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();

  favoriteContainer.bind<FavoriteService>(Component.FavoriteService).to(DefaultFavoriteService);
  favoriteContainer.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);

  return favoriteContainer;
}
