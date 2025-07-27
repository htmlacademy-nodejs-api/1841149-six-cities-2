import { Author, City, Coordinates, FacilityType, RentalOffer, RentalOfferType, UserType } from '../types/index.js';

export function generateRentalOffer(rentalOfferData: string): RentalOffer {
  const [
    name,
    description,
    publishDate,
    city,
    imagePreview,
    photos,
    isPremium,
    isFavourite,
    rating,
    type,
    roomNumber,
    guestNumber,
    price,
    facilities,
    author,
    commentsCount,
    coordinates
  ] = rentalOfferData.replace('\n', '').split('\t');

  const getAuthor = (authorString: string): Author => {
    const [userName, email, avatar, userType] = authorString.split(';');
    return {
      name: userName,
      email,
      avatar,
      userType: UserType[userType as UserType],
    };
  };

  const getFacilities = (facilitiesString: string): FacilityType[] =>
    facilitiesString
      .split(';')
      .map((facility) => FacilityType[facility as 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge']);

  const getCoordinates = (coordinatesString: string): Coordinates => {
    const [longitude, latitude] = coordinatesString.split(';');
    return {
      longitude: Number(longitude),
      latitude: Number(latitude)
    };
  };

  const getCity = (cityString: string): City => {
    const [cityName, location] = cityString.split(';');
    const [longitude, latitude] = location.split(';');
    return {
      name: cityName,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    };
  };

  return {
    name,
    description,
    publishDate: new Date(publishDate),
    city: getCity(city),
    imagePreview,
    photos: photos.split(';').map((photo) => photo),
    isPremium: Boolean(isPremium),
    isFavourite: Boolean(isFavourite),
    rating: parseFloat(Number(rating).toFixed(1)),
    type: RentalOfferType[type as 'Apartment' | 'House' | 'Room' | 'Hotel'],
    roomNumber: Number.parseInt(roomNumber, 10),
    guestNumber: Number.parseInt(guestNumber, 10),
    price: Number.parseInt(price, 10),
    facilities: getFacilities(facilities),
    author: getAuthor(author),
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: getCoordinates(coordinates),
  };
}
