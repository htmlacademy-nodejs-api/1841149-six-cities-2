import { MockServerData } from '../../types/index.js';

export class TSVRentalCitiesGenerator {
  constructor(private readonly mockData: MockServerData) {
    console.log(this.mockData);
  }

  public generate(): string {
    const cities = this.mockData.cities;

    return cities
      .map((city) => `${city.name};${city.location.latitude};${city.location.longitude}`)
      .join('\n');
  }
}
