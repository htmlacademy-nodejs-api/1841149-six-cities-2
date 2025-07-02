import { CommentService } from './comment-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DEFAULT_COMMENTS_COUNT } from './comment.constants.js';
import { OfferService } from '../offer/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: types.DocumentType<OfferService>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`Created comment "${result}"`);

    await this.offerService.incCommentCount(dto.offerId);
    await this.offerService.calculateRating(dto.offerId);

    return result;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_COMMENTS_COUNT)
      .populate('authorId');
  }

  public async deleteCommentsByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId });

    return result.deletedCount;
  }
}
