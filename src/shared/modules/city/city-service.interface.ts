import { CreateCityDto } from './dto/create-city.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CityEntity } from './city.entity.js';

export interface CityService {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByNameOrCreate(cityName: string, dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  find(): Promise<DocumentType<CityEntity>[]>;
}
