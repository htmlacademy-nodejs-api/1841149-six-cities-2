import { Expose } from 'class-transformer';

export class FacilityRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;
}
