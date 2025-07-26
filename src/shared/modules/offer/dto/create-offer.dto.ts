import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsMongoId, IsNumber,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.message.js';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsNumber({}, { message: CreateOfferValidationMessage.coordinates.latitude.invalid })
    latitude: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.coordinates.longitude.invalid })
    longitude: number;
}

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.name.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.name.maxLength })
    name: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
    description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.publishDate.invalidFormat })
    publishDate: Date;

  @IsMongoId({ message: CreateOfferValidationMessage.cityId.invalid })
    cityId: string;

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
    isPremium: boolean;

  @IsMongoId({ message: CreateOfferValidationMessage.typeId.invalid })
    typeId: string;

  @IsInt({ message: CreateOfferValidationMessage.roomNumber.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomNumber.min })
  @Max(8, { message: CreateOfferValidationMessage.roomNumber.max })
    roomNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.guestNumber.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestNumber.min })
  @Max(10, { message: CreateOfferValidationMessage.guestNumber.max })
    guestNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.roomNumber.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.roomNumber.min })
  @Max(100000, { each: true, message: CreateOfferValidationMessage.roomNumber.max })
    price: number;

  @IsMongoId({ each: true, message: CreateOfferValidationMessage.facilities.invalid })
    facilities: string[];

  authorId: string;

  @ValidateNested({})
  @Type(() => CoordinatesDto)
    coordinates: CoordinatesDto;
}
