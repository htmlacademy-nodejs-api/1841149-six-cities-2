import { Expose } from 'class-transformer';

interface Location {
  latitude: number;
  longitude: number;
}

export class CityRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public location: Location;
}
