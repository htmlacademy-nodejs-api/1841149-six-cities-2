import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Error } from 'mongoose';
import { ApplicationError, ValidationErrorField } from '../libs/rest/index.js';
import { ValidationError } from 'class-validator';
import { City } from '../types/index.js';

export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[], count: number):T[] {
  const start = generateRandomValue(0, items.length - count);
  return items.slice(start, start + count);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function generateRandomBoolean() {
  return (Math.random() < 0.5);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : error;
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

export function getRentalFacility(facilityData: string): string {
  const [name] = facilityData.replace('\n', '').split('\t');

  return name;
}

export function getRentalType(typeData: string): string {
  const [name] = typeData.replace('\n', '').split('\t');

  return name;
}

export function getRentalCity(cityData: string): City {
  const [name, latitude, longitude] = cityData.replace('\n', '').split(';');

  return {
    name,
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude)
    }
  };
}
