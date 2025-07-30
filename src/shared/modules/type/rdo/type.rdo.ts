import { Expose } from 'class-transformer';

export class TypeRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;
}
