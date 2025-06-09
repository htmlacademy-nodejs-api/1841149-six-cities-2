import { CoordinateService } from './coordinate-service.interface.js';
import { Component } from '../../types/index.js';
import { inject } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CoordinateEntity } from './coordinate.entity.js';
import { CreateCoordinateDto } from './dto/create-coordinate.dto.js';

export class DefaultCoordinateService implements CoordinateService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CoordinateModel) private readonly coordinateModel: types.ModelType<CoordinateEntity>
  ) {}

  public async create(dto: CreateCoordinateDto): Promise<DocumentType<CoordinateEntity>> {
    const result = await this.coordinateModel.create(dto);
    this.logger.info(`Created coordinate "${result.name}"`);
    return result;
  }

  public async findByCoordinateId(coordinateId: string): Promise<DocumentType<CoordinateEntity> | null> {
    return this.coordinateModel.findById(coordinateId).exec();
  }

  public async findByCoordinateName(coordinateName: string): Promise<DocumentType<CoordinateEntity> | null> {
    return this.coordinateModel.findOne({ name: coordinateName}).exec();
  }

  public async findByCoordinateNameOrCreate(coordinateName: string, dto: CreateCoordinateDto): Promise<DocumentType<CoordinateEntity>> {
    const existedCoordinate = await this.findByCoordinateName(coordinateName);

    if (existedCoordinate) {
      return existedCoordinate;
    }

    return this.create(dto);
  }
}
