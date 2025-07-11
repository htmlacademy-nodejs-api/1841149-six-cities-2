import { IsMongoId, IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(5, 1024, { message: CreateCommentMessages.text.length })
  public text: string;

  @IsNumber({}, { message: CreateCommentMessages.rating.invalidFormat })
  @Min(1, { message: CreateCommentMessages.rating.minValue })
  @Max(5, { message: CreateCommentMessages.rating.maxValue })
  public rating: number;

  public authorId: string;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId: string;
}
