import { CreateTypeDto } from './dto/create-type.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { TypeEntity } from './type.entity.js';

export interface TypeService {
  create(dto: CreateTypeDto): Promise<DocumentType<TypeEntity>>;
  findByTypeId(typeId: string): Promise<DocumentType<TypeEntity> | null>;
  findByTypeName(categoryName: string): Promise<DocumentType<TypeEntity> | null>;
  findByTypeNameOrCreate(categoryName: string, dto: CreateTypeDto): Promise<DocumentType<TypeEntity>>;
  find(): Promise<DocumentType<TypeEntity>[]>;
}
