import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { generateRentalOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { CoordinateModel, CoordinateService, DefaultCoordinateService } from '../../shared/modules/coordinate/index.js';
import { DefaultFacilityService, FacilityModel, FacilityService } from '../../shared/modules/facility/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultTypeService, TypeModel, TypeService } from '../../shared/modules/type/index.js';
import { DefaultUserService, UserService, UserModel } from '../../shared/modules/user/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { RentalOffer } from '../../shared/types/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private coordinateService: CoordinateService;
  private facilityService: FacilityService;
  private offerService: OfferService;
  private typeService: TypeService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.coordinateService = new DefaultCoordinateService(this.logger, CoordinateModel);
    this.facilityService = new DefaultFacilityService(this.logger, FacilityModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.typeService = new DefaultTypeService(this.logger, TypeModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = generateRentalOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private async onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    await this.databaseClient.disconnect();
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

    const coordinates = await this.coordinateService.findByCoordinateNameOrCreate(offer.city, { name: offer.city, latitude: offer.coordinates.latitude, longitude: offer.coordinates.longitude});

    await this.offerService.create({
      facilities,
      authorId: user.id,
      name: offer.name,
      description: offer.description,
      publishDate: offer.publishDate,
      city: offer.city,
      imagePreview: offer.imagePreview,
      photos: offer.photos,
      isPremium: offer.isPremium,
      isFavourite: offer.isFavourite,
      rating: offer.rating,
      typeId: offerType.id,
      roomNumber: offer.roomNumber,
      guestNumber: offer.guestNumber,
      price: offer.price,
      coordinatesId: coordinates?.id,
      commentsCount: 0,
    });
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

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
