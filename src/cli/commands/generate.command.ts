import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import {
  TSVRentalCitiesGenerator,
  TSVRentalOfferGenerator,
  TSVRentalTypesGenerator,
  TSVRentalFacilitiesGenerator
} from '../../shared/libs/rental-offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import axios from 'axios';

export class GenerateCommand implements Command {
  private initialData: MockServerData;
  private facilitiesFilePath = './mocks/facilities.tsv';
  private typesFilePath = './mocks/types.tsv';
  private citiesFilePath = './mocks/cities.tsv';


  private async load(url: string) {
    try {
      const res = await axios.get(url);
      this.initialData = res.data;
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, rentalOfferCount: number) {
    const tsvOfferGenerator = new TSVRentalOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < rentalOfferCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  private async writeFacilities() {
    const tsvFacilitiesGenerator = new TSVRentalFacilitiesGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(this.facilitiesFilePath);

    await tsvFileWriter.write(tsvFacilitiesGenerator.generate());
  }

  private async writeTypes() {
    const tsvTypesGenerator = new TSVRentalTypesGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(this.typesFilePath);

    await tsvFileWriter.write(tsvTypesGenerator.generate());
  }

  private async writeCities() {
    const tsvCitiesGenerator = new TSVRentalCitiesGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(this.citiesFilePath);

    await tsvFileWriter.write(tsvCitiesGenerator.generate());
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const rentalOfferCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.writeFacilities();
      await this.writeTypes();
      await this.writeCities();
      await this.write(filepath, rentalOfferCount);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }
}
