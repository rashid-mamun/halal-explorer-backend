const Joi = require('joi');

// Validator for traveller type
const travellerTypeValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for policy type
const policyTypeValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for area
const areaValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for rest type
const restTypeValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for product name
const productNameValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for age group
const ageGroupValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  minAge: Joi.number().min(0).max(120).required(),
  maxAge: Joi.number().min(0).max(120).required()
}).custom((value, helpers) => {
  if (value.minAge >= value.maxAge) {
    return helpers.error('any.invalid', { message: 'minAge must be less than maxAge' });
  }
  return value;
});

// Validator for country
const countryValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  code: Joi.string().required().trim().min(2).max(3).uppercase()
});

// Validator for duration
const durationValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  days: Joi.number().min(1).max(365).required()
});

module.exports = {
  travellerTypeValidator,
  policyTypeValidator,
  areaValidator,
  restTypeValidator,
  productNameValidator,
  ageGroupValidator,
  countryValidator,
  durationValidator
};
