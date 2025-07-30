export const UpdateOfferMessages = {
  name: {
    minLength: 'Minimum name length must be 10',
    maxLength: 'Maximum name length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  publishDate: {
    invalidFormat: 'publishDate must be a valid ISO date',
  },
  cityId: {
    invalid: 'cityId must be a valid id',
  },
  imagePreview: {
    maxLength: 'Too short for field «imagePreview»',
  },
  photos: {
    invalidFormat: 'photos must be an array',
    invalidCount: 'photos must be an array of 6 photos',
    maxLength: 'Too short for field «photos»',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  typeId: {
    invalid: 'typeId must be a valid id',
  },
  roomNumber: {
    invalidFormat: 'roomNumber must be a integer',
    min: 'Minimum roomNumber is 1',
    max: 'Maximum roomNumber is 8',
  },
  guestNumber: {
    invalidFormat: 'roomNumber must be a integer',
    min: 'Minimum roomNumber is 1',
    max: 'Maximum roomNumber is 10',
  },
  price: {
    invalidFormat: 'roomNumber must be a integer',
    min: 'Minimum roomNumber is 100',
    max: 'Maximum roomNumber is 100 000',
  },
  facilities: {
    invalid: 'facilities must be a valid id',
  },
  coordinates: {
    longitude: {
      invalid: 'longitude must be integer',
    },
    latitude: {
      invalid: 'latitude must be integer',
    }
  }
};
