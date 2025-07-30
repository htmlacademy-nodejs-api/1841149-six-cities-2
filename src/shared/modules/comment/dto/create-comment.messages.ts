export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text field is required',
    length: 'min length is 5, max is 1024'
  },
  rating: {
    invalidFormat: 'rating must be a number',
    minValue: 'min value is 1',
    maxValue: 'max value is 5',
  },
  authorId: {
    invalidFormat: 'authorId field must be an valid id',
  },
  offerId: {
    invalidFormat: 'offerId field must be an valid id',
  },
} as const;
