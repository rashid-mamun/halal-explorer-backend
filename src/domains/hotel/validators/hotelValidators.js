const Joi = require('joi');

// Hotel search validation
const hotelSearchSchema = Joi.object({
  city: Joi.string().required(),
  checkin: Joi.string().required(),
  checkout: Joi.string().required(),
  guests: Joi.string().required(),
  currency: Joi.string().required(),
  residency: Joi.string().required()
});

// Hotel search filter validation
const hotelSearchFilterSchema = Joi.object({
  searchId: Joi.string().required(),
  travellerRating: Joi.string(),
  amenities: Joi.array().items(Joi.string()),
  deals: Joi.array().items(Joi.string()),
  halalRating: Joi.string()
});

// Hotel search details validation
const hotelSearchDetailsSchema = Joi.object({
  checkin: Joi.string().required(),
  checkout: Joi.string().required(),
  guests: Joi.string().required(),
  currency: Joi.string().required(),
  residency: Joi.string().required(),
  id: Joi.string().required()
});

// Hotel booking validation
const hotelBookSchema = Joi.object({
  book_hash: Joi.string().required(),
  guests: Joi.array().items(
    Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
    })
  ).required(),
  priceDetails: Joi.object().required(),
  paymentDetails: Joi.object().required(),
  orderInfo: Joi.object().required(),
  userInfo: Joi.object().required(),
});

// Hotel by ID validation
const hotelByIdSchema = Joi.object({
  id: Joi.string().required()
});

// Halal rating validation
const halalRatingSchema = Joi.object({
  id: Joi.string().required(),
  ratings: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

// Halal rating structure validation
const halalRatingStructureSchema = Joi.object({
  ratings: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

// Get halal hotel validation
const getHalalHotelSchema = Joi.object({
  id: Joi.string().required()
});

// Manager info validation
const managerInfoSchema = Joi.object({
  managerName: Joi.string().required(),
  email: Joi.string().email().required(),
  id: Joi.string().required(),
});

// Get manager info validation
const getManagerInfoSchema = Joi.object({
  id: Joi.string().required()
});

module.exports = {
  hotelSearchSchema,
  hotelSearchFilterSchema,
  hotelSearchDetailsSchema,
  hotelBookSchema,
  hotelByIdSchema,
  halalRatingSchema,
  halalRatingStructureSchema,
  getHalalHotelSchema,
  managerInfoSchema,
  getManagerInfoSchema
};
