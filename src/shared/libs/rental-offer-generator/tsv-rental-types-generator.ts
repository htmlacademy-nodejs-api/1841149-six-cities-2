import { MockServerData } from '../../types/index.js';

export class TSVRentalTypesGenerator {
  constructor(private readonly mockData: MockServerData) {
    console.log(this.mockData);
  }

  public generate(): string {
    const names = this.mockData.types;


    return names.join('\n');
  }
}
