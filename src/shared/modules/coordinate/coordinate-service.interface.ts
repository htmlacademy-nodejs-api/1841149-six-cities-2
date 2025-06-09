import { CreateCoordinateDto } from './dto/create-coordinate.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CoordinateEntity } from './coordinate.entity.js';

export interface CoordinateService {
  create(dto: CreateCoordinateDto): Promise<DocumentType<CoordinateEntity>>;
  findByCoordinateId(coordinateId: string): Promise<DocumentType<CoordinateEntity> | null>;
  findByCoordinateName(coordinateName: string): Promise<DocumentType<CoordinateEntity> | null>;
  findByCoordinateNameOrCreate(coordinateName: string, dto: CreateCoordinateDto): Promise<DocumentType<CoordinateEntity>>;
}
