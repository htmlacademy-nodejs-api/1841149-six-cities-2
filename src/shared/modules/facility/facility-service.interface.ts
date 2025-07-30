import { CreateFacilityDto } from './dto/create-facility.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { FacilityEntity } from './facility.entity.js';

export interface FacilityService {
  create(dto: CreateFacilityDto): Promise<DocumentType<FacilityEntity>>;
  findByFacilityId(facilityId: string): Promise<DocumentType<FacilityEntity> | null>;
  findByFacilityName(facilityName: string): Promise<DocumentType<FacilityEntity> | null>;
  findByFacilityNameOrCreate(facilityName: string, dto: CreateFacilityDto): Promise<DocumentType<FacilityEntity>>;
  find(): Promise<DocumentType<FacilityEntity>[]>;
}
