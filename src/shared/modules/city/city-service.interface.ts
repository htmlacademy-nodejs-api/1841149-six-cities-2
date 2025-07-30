import { CreateCityDto } from './dto/create-city.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CityEntity } from './city.entity.js';
import { DocumentExists } from '../../types/index.js';

export interface CityService extends DocumentExists {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByNameOrCreate(cityName: string, dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  find(): Promise<DocumentType<CityEntity>[]>;
  exists(documentId: string): Promise<boolean>;
}
