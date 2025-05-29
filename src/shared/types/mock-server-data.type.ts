import { Author, Coordinates} from './index.js';

export type MockServerData = {
  names: string[],
  descriptions: string[],
  cities: string[],
  imagePreviews: string[],
  photos: string[],
  types: string[],
  facilities: string[],
  authors: Author[],
  coordinates: Record<string, Coordinates>
}
