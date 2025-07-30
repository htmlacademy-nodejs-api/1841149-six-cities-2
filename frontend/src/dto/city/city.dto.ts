export interface CityDto {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
