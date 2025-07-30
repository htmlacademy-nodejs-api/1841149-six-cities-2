import { RestApplication } from './rest/index.js';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createTypeContainer } from './shared/modules/type/index.js';
import { createFacilityContainer } from './shared/modules/facility/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createFavoriteContainer } from './shared/modules/favorite/index.js';
import { createCityContainer } from './shared/modules/city/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createTypeContainer(),
    createFacilityContainer(),
    createCommentContainer(),
    createOfferContainer(),
    createFavoriteContainer(),
    createCityContainer(),
    createAuthContainer()
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  application.init();
}

bootstrap();
