import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import {
  generateRentalOffer,
  getErrorMessage,
  getMongoURI, getRentalCity,
  getRentalFacility,
  getRentalType
} from '../../shared/helpers/index.js';
import { DefaultFacilityService, FacilityModel, FacilityService } from '../../shared/modules/facility/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultTypeService, TypeModel, TypeService } from '../../shared/modules/type/index.js';
import { DefaultUserService, UserService, UserModel } from '../../shared/modules/user/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { City, RentalOffer } from '../../shared/types/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { CityModel, CityService, DefaultCityService } from '../../shared/modules/city/index.js';
import { FavoriteModel } from '../../shared/modules/favorite/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private facilityService: FacilityService;
  private cityService: CityService;
  private offerService: OfferService;
  private typeService: TypeService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;
  private completedFiles = 0;
  private totalFiles = 4;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onImportFacilityLine = this.onImportFacilityLine.bind(this);
    this.onImportTypeLine = this.onImportTypeLine.bind(this);
    this.onImportCityLine = this.onImportCityLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
    this.onCompleteFacilitiesImport = this.onCompleteFacilitiesImport.bind(this);
    this.onCompleteTypeImport = this.onCompleteTypeImport.bind(this);
    this.onCompleteCitiesImport = this.onCompleteCitiesImport.bind(this);

    this.logger = new ConsoleLogger();
    this.facilityService = new DefaultFacilityService(this.logger, FacilityModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel, CityModel, TypeModel, FacilityModel, FavoriteModel);
    this.typeService = new DefaultTypeService(this.logger, TypeModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.cityService = new DefaultCityService(this.logger, CityModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = generateRentalOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private async onImportFacilityLine(line: string, resolve: () => void) {
    const facility = getRentalFacility(line);
    await this.saveFacility(facility);
    resolve();
  }

  private async onImportTypeLine(line: string, resolve: () => void) {
    const type = getRentalType(line);
    await this.saveType(type);
    resolve();
  }

  private async onImportCityLine(line: string, resolve: () => void) {
    const city = getRentalCity(line);
    await this.saveCity(city);
    resolve();
  }

  private async onCompleteImport(count: number) {
    console.info(`${count} offers imported.`);
    this.completedFiles++;
    await this.checkAllImportsComplete();
  }

  private async onCompleteTypeImport(count: number) {
    console.info(`${count} types imported.`);
    this.completedFiles++;
    await this.checkAllImportsComplete();
  }

  private async onCompleteFacilitiesImport(count: number) {
    console.info(`${count} facilities imported.`);
    this.completedFiles++;
    await this.checkAllImportsComplete();
  }

  private async onCompleteCitiesImport(count: number) {
    console.info(`${count} cities imported.`);
    this.completedFiles++;
    await this.checkAllImportsComplete();
  }

  private async saveOffer(offer: RentalOffer) {
    const facilities: string[] = [];
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD,
    }, this.salt);

    for (const name of offer.facilities) {
      const existFacility = await this.facilityService.findByFacilityNameOrCreate(name, { name });

      facilities.push(existFacility.id);
    }

    const offerType = await this.typeService.findByTypeNameOrCreate(offer.type, { name: offer.type });
    const city = await this.cityService.findByNameOrCreate(offer.city.name, { name: offer.city.name, location: offer.city.location });

    await this.offerService.create({
      facilities,
      authorId: user.id,
      name: offer.name,
      description: offer.description,
      publishDate: offer.publishDate,
      cityId: city.id,
      isPremium: offer.isPremium,
      typeId: offerType.id,
      roomNumber: offer.roomNumber,
      guestNumber: offer.guestNumber,
      price: offer.price,
      coordinates: {
        latitude: offer.coordinates.latitude,
        longitude: offer.coordinates.longitude
      },
    });
  }

  private async saveFacility(name: string) {
    await this.facilityService.findByFacilityNameOrCreate(name, { name });
  }

  private async saveType(name: string) {
    await this.typeService.findByTypeNameOrCreate(name, { name });
  }

  private async saveCity(city: City) {
    await this.cityService.findByNameOrCreate(city.name, { name: city.name, location: city.location });
  }

  private async checkAllImportsComplete() {
    if (this.completedFiles === this.totalFiles) {
      console.info('All imports completed.');
      await this.databaseClient.disconnect();
    }
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string) {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    const facilityFileReader = new TSVFileReader('./mocks/facilities.tsv');

    facilityFileReader.on('line', this.onImportFacilityLine);
    facilityFileReader.on('end', this.onCompleteFacilitiesImport);

    const typeFileReader = new TSVFileReader('./mocks/types.tsv');

    typeFileReader.on('line', this.onImportTypeLine);
    typeFileReader.on('end', this.onCompleteTypeImport);

    const cityFileReader = new TSVFileReader('./mocks/cities.tsv');

    cityFileReader.on('line', this.onImportCityLine);
    cityFileReader.on('end', this.onCompleteCitiesImport);

    try {
      await facilityFileReader.read();
      await typeFileReader.read();
      await cityFileReader.read();
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
