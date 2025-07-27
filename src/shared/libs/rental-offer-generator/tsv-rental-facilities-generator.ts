import { MockServerData } from '../../types/index.js';

export class TSVRentalFacilitiesGenerator {
  constructor(private readonly mockData: MockServerData) {
    console.log(this.mockData);
  }

  public generate(): string {
    const names = this.mockData.facilities;


    return names.join('\n');
  }
}
