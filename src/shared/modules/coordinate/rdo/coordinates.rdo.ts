import { Expose } from 'class-transformer';

export class CoordinatesRdo {
  @Expose()
  public longitude: string;

  @Expose()
  public latitude: string;
}
