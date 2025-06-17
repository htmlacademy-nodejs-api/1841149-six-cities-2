import { TypeService } from './type-service.interface.js';
import { Component } from '../../types/index.js';
import { inject } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { TypeEntity } from './type.entity.js';
import { CreateTypeDto } from './dto/create-type.dto.js';

export class DefaultTypeService implements TypeService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.TypeModel) private readonly typeModel: types.ModelType<TypeEntity>
  ) {}

  public async create(dto: CreateTypeDto): Promise<DocumentType<TypeEntity>> {
    const result = await this.typeModel.create(dto);
    this.logger.info(`Created type "${result.name}"`);
    return result;
  }

  public async findByTypeId(typeId: string): Promise<DocumentType<TypeEntity> | null> {
    return this.typeModel.findById(typeId).exec();
  }

  public async findByTypeName(typeName: string): Promise<DocumentType<TypeEntity> | null> {
    return this.typeModel.findOne({ name: typeName}).exec();
  }

  public async findByTypeNameOrCreate(typeName: string, dto: CreateTypeDto): Promise<DocumentType<TypeEntity>> {
    const existedType = await this.findByTypeName(typeName);

    if (existedType) {
      return existedType;
    }

    return this.create(dto);
  }

  public async find(): Promise<DocumentType<TypeEntity>[]> {
    return this.typeModel.find();
  }
}
