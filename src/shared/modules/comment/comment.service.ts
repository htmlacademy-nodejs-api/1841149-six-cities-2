import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { inject } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.TypeModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`Created comment "${result}"`);
    return result;
  }

  public async findByAuthorId(authorId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ authorId }).populate('authorId');
  }
}
