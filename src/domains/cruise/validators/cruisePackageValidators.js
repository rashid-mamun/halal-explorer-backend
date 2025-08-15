const Joi = require('joi');

// Validator for creating cruise package
const createCruisePackageValidator = Joi.object({
  id: Joi.string().optional(),
  destination: Joi.string().required().trim().min(1).max(200),
  cruiseLine: Joi.string().required().trim().min(1).max(100),
  ship: Joi.string().optional().trim().max(100),
  sailingDates: Joi.array().items(Joi.date().greater('now')).required().min(1),
  length: Joi.string().required().trim().min(1).max(50),
  commentForLength: Joi.string().optional().trim().max(500),
  itinerary: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).required().min(1),
  shipFacts: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  shipInfo: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  policies: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  roomTypes: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).required().min(1),
  price: Joi.object({
    startsFrom: Joi.string().required().trim().max(50)
  }).required(),
  gallery: Joi.array().items(Joi.string().trim().max(500)).optional()
});

// Validator for updating cruise package
const updateCruisePackageValidator = Joi.object({
  destination: Joi.string().optional().trim().min(1).max(200),
  cruiseLine: Joi.string().optional().trim().min(1).max(100),
  ship: Joi.string().optional().trim().max(100),
  sailingDates: Joi.array().items(Joi.date().greater('now')).optional(),
  length: Joi.string().optional().trim().min(1).max(50),
  commentForLength: Joi.string().optional().trim().max(500),
  itinerary: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  shipFacts: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  shipInfo: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  policies: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  roomTypes: Joi.array().items(Joi.object({
    key: Joi.string().required().trim().max(100),
    value: Joi.string().required().trim().max(500)
  })).optional(),
  price: Joi.object({
    startsFrom: Joi.string().required().trim().max(50)
  }).optional(),
  gallery: Joi.array().items(Joi.string().trim().max(500)).optional()
});

// Validator for searching cruise packages
const searchCruisePackageValidator = Joi.object({
  destination: Joi.string().optional().trim(),
  cruiseLine: Joi.string().optional().trim(),
  ship: Joi.string().optional().trim(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sailingDate: Joi.date().optional()
}).custom((value, helpers) => {
  if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
    return helpers.error('any.invalid', { message: 'minPrice cannot be greater than maxPrice' });
  }
  return value;
});

module.exports = {
  createCruisePackageValidator,
  updateCruisePackageValidator,
  searchCruisePackageValidator
};
