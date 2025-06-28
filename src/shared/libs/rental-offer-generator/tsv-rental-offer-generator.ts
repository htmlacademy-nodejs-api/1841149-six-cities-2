import { MockServerData } from '../../types/index.js';
import { generateRandomBoolean, generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import dayjs from 'dayjs';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MIN_PRICE = 100;
const MAX_PRICE = 1000;
const PHOTOS_COUNT = 6;
const MIN_RATING = 1;
const MAX_RATING = 5;
const RATING_DECIMAL = 1;
const MIN_ROOM_NUMBER = 1;
const MAX_ROOM_NUMBER = 8;
const MIN_GUEST_NUMBER = 1;
const MAX_GUEST_NUMBER = 8;
const MIN_FACILITIES_NUMBER = 1;
const MAX_FACILITIES_NUMBER = 8;

export class TSVRentalOfferGenerator {
  constructor(private readonly mockData: MockServerData) {
    console.log(this.mockData);
  }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreviews);
    const photos = getRandomItems<string>(this.mockData.photos, PHOTOS_COUNT).join(';');
    const isPremium = generateRandomBoolean();
    const isFavourite = generateRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, RATING_DECIMAL);
    const type = getRandomItem<string>(this.mockData.types);
    const roomNumber = generateRandomValue(MIN_ROOM_NUMBER, MAX_ROOM_NUMBER);
    const guestNumber = generateRandomValue(MIN_GUEST_NUMBER, MAX_GUEST_NUMBER);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const facilities = getRandomItems<string>(this.mockData.facilities, generateRandomValue(MIN_FACILITIES_NUMBER, MAX_FACILITIES_NUMBER)).join(';');
    const commentsCount = 0;
    const author = Object.values(getRandomItem(this.mockData.authors)).join(';');
    const coordinates = Object.values(this.mockData.coordinates[city]).join(';');

    const publishDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();


    return [
      name, description, publishDate, city, imagePreview, photos, isPremium, isFavourite, rating, type, roomNumber, guestNumber, price, facilities, author, commentsCount, coordinates
    ].join('\t');
  }
}
