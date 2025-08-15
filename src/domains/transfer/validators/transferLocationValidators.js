const Joi = require('joi');

/**
 * Validation schema for getting countries
 */
const getCountriesSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for getting destinations
 */
const getDestinationsSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  countryCode: Joi.string().default(''),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for getting terminals
 */
const getTerminalsSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  countryCode: Joi.string().default(''),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for getting hotels
 */
const getHotelsSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  countryCodes: Joi.string().default(''),
  destinationCodes: Joi.string().default(''),
  codes: Joi.string().default(''),
  giataCodes: Joi.string().default(''),
  offset: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for getting pickups
 */
const getPickupsSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for searching locations
 */
const searchLocationsSchema = Joi.object({
  keyword: Joi.string().required().min(1),
  type: Joi.string().valid('country', 'destination', 'terminal', 'hotel', 'pickup'),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

/**
 * Validation schema for getting locations by type
 */
const getLocationsByTypeSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

/**
 * Validation schema for location type parameter
 */
const locationTypeSchema = Joi.object({
  type: Joi.string().valid('country', 'destination', 'terminal', 'hotel', 'pickup').required()
});

/**
 * Validation schema for location code and type parameters
 */
const locationCodeSchema = Joi.object({
  code: Joi.string().required(),
  type: Joi.string().valid('country', 'destination', 'terminal', 'hotel', 'pickup').required()
});

module.exports = {
  getCountriesSchema,
  getDestinationsSchema,
  getTerminalsSchema,
  getHotelsSchema,
  getPickupsSchema,
  searchLocationsSchema,
  getLocationsByTypeSchema,
  locationTypeSchema,
  locationCodeSchema
};
