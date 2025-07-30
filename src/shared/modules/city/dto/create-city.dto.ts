import { IsNumber, ValidateNested } from 'class-validator';
import { CreateOfferValidationMessage } from '../../offer/index.js';
import { Type } from 'class-transformer';

class Location {
  @IsNumber({}, { message: CreateOfferValidationMessage.coordinates.latitude.invalid })
    latitude: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.coordinates.longitude.invalid })
    longitude: number;
}

export class CreateCityDto {
  name: string;

  @ValidateNested({})
  @Type(() => Location)
    location: Location;
}
