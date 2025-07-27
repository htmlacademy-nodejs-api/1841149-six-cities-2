import { Author, City, Coordinates } from './index.js';

export type MockServerData = {
  names: string[],
  descriptions: string[],
  cities: City[],
  imagePreviews: string[],
  photos: string[],
  types: string[],
  facilities: string[],
  authors: Author[],
  coordinates: Coordinates[],
}
