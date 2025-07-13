import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsMongoId,
  IsOptional,
  Length, Max,
  MaxLength, Min,
  MinLength, ValidateNested
} from 'class-validator';
import { UpdateOfferMessages } from './update-offer.messages.js';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsInt({ message: UpdateOfferMessages.coordinates.latitude.invalid })
    latitude: number;

  @IsInt({ message: UpdateOfferMessages.coordinates.longitude.invalid })
    longitude: number;
}

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateOfferMessages.name.minLength })
  @MaxLength(100, { message: UpdateOfferMessages.name.maxLength })
  public name?: string;

  @IsOptional()
  @MinLength(20, { message: UpdateOfferMessages.description.minLength })
  @MaxLength(1024, { message: UpdateOfferMessages.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: UpdateOfferMessages.publishDate.invalidFormat })
  public publishDate?: Date;

  @IsOptional()
  @IsMongoId({ message: UpdateOfferMessages.cityId.invalid })
  public cityId?: string;

  @IsOptional()
  @MaxLength(256, { message: UpdateOfferMessages.imagePreview.maxLength })
  public imagePreview?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.photos.invalidFormat })
  @MaxLength(256, { each: true, message: UpdateOfferMessages.photos.maxLength })
  @Length(6,6, { message: UpdateOfferMessages.photos.invalidCount })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferMessages.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsMongoId({ message: UpdateOfferMessages.typeId.invalid })
  public typeId?: string;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.roomNumber.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.roomNumber.min })
  @Max(8, { message: UpdateOfferMessages.roomNumber.max })
  public roomNumber?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.guestNumber.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.guestNumber.min })
  @Max(10, { message: UpdateOfferMessages.guestNumber.max })
  public guestNumber?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.roomNumber.invalidFormat })
  @Min(100, { message: UpdateOfferMessages.roomNumber.min })
  @Max(100000, { each: true, message: UpdateOfferMessages.roomNumber.max })
  public price?: number;

  @IsOptional()
  @IsMongoId({ each: true, message: UpdateOfferMessages.facilities.invalid })
  public facilities?: string[];

  @ValidateNested({})
  @Type(() => CoordinatesDto)
    coordinates?: CoordinatesDto;
}
