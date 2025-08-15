const Joi = require('joi');

// Validator for creating holiday package
const createHolidayPackageValidator = Joi.object({
  id: Joi.string().optional(),
  packageName: Joi.string().required().trim().min(1).max(200),
  address: Joi.string().required().trim().min(1).max(500),
  duration: Joi.object({
    days: Joi.number().integer().min(1).max(365).required(),
    nights: Joi.number().integer().min(1).max(365).required()
  }).required(),
  startingPrice: Joi.number().min(0).max(1000000).required(),
  description: Joi.string().required().trim().min(10).max(2000),
  whatsIncluded: Joi.array().items(Joi.string().trim().max(200)).optional(),
  geoLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).required(),
  coverImage: Joi.string().optional().trim().max(500),
  gallery: Joi.array().items(Joi.string().trim().max(500)).optional(),
  durationDescription: Joi.array().items(Joi.object({
    titles: Joi.string().required().trim().max(100),
    food: Joi.string().required().trim().max(100),
    des: Joi.string().required().trim().max(500)
  })).required().min(1),
  paxWisePrice: Joi.object({
    adult: Joi.number().integer().min(0).max(100000).required(),
    child: Joi.number().integer().min(0).max(100000).required(),
    infant: Joi.number().integer().min(0).max(100000).required(),
    single: Joi.number().integer().min(0).max(100000).required()
  }).required(),
  departureDates: Joi.array().items(Joi.date().greater('now')).required().min(1),
  seats: Joi.number().integer().min(0).max(1000).required(),
  optionalTours: Joi.array().items(Joi.object({
    title: Joi.string().required().trim().max(200),
    description: Joi.array().items(Joi.string().trim().max(500))
  })).optional(),
  currency: Joi.string().optional().default('AED')
});

// Validator for updating holiday package
const updateHolidayPackageValidator = Joi.object({
  packageName: Joi.string().optional().trim().min(1).max(200),
  address: Joi.string().optional().trim().min(1).max(500),
  duration: Joi.object({
    days: Joi.number().integer().min(1).max(365).required(),
    nights: Joi.number().integer().min(1).max(365).required()
  }).optional(),
  startingPrice: Joi.number().min(0).max(1000000).optional(),
  description: Joi.string().optional().trim().min(10).max(2000),
  whatsIncluded: Joi.array().items(Joi.string().trim().max(200)).optional(),
  geoLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).optional(),
  coverImage: Joi.string().optional().trim().max(500),
  gallery: Joi.array().items(Joi.string().trim().max(500)).optional(),
  durationDescription: Joi.array().items(Joi.object({
    titles: Joi.string().required().trim().max(100),
    food: Joi.string().required().trim().max(100),
    des: Joi.string().required().trim().max(500)
  })).optional(),
  paxWisePrice: Joi.object({
    adult: Joi.number().integer().min(0).max(100000).required(),
    child: Joi.number().integer().min(0).max(100000).required(),
    infant: Joi.number().integer().min(0).max(100000).required(),
    single: Joi.number().integer().min(0).max(100000).required()
  }).optional(),
  departureDates: Joi.array().items(Joi.date().greater('now')).optional(),
  seats: Joi.number().integer().min(0).max(1000).optional(),
  optionalTours: Joi.array().items(Joi.object({
    title: Joi.string().required().trim().max(200),
    description: Joi.array().items(Joi.string().trim().max(500))
  })).optional(),
  currency: Joi.string().optional()
});

// Validator for searching holiday packages
const searchHolidayPackageValidator = Joi.object({
  packageName: Joi.string().optional().trim(),
  address: Joi.string().optional().trim(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  minDays: Joi.number().min(1).optional(),
  maxDays: Joi.number().min(1).optional(),
  availableSeats: Joi.number().min(1).optional()
}).custom((value, helpers) => {
  if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
    return helpers.error('any.invalid', { message: 'minPrice cannot be greater than maxPrice' });
  }
  if (value.minDays && value.maxDays && value.minDays > value.maxDays) {
    return helpers.error('any.invalid', { message: 'minDays cannot be greater than maxDays' });
  }
  return value;
});

module.exports = {
  createHolidayPackageValidator,
  updateHolidayPackageValidator,
  searchHolidayPackageValidator
};
