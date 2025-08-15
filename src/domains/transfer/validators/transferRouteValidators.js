const Joi = require('joi');

/**
 * Validation schema for getting routes
 */
const getRoutesSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  destinationCode: Joi.string().required(),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for route ID parameter
 */
const routeIdSchema = Joi.object({
  routeId: Joi.string().required()
});

/**
 * Validation schema for destination code parameter
 */
const destinationCodeSchema = Joi.object({
  destinationCode: Joi.string().required()
});

/**
 * Validation schema for location code parameter
 */
const locationCodeSchema = Joi.object({
  locationCode: Joi.string().required()
});

/**
 * Validation schema for searching routes by location
 */
const searchRoutesByLocationSchema = Joi.object({
  locationType: Joi.string().valid('from', 'to', 'both').default('from'),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

/**
 * Validation schema for getting all routes
 */
const getAllRoutesSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
  getRoutesSchema,
  routeIdSchema,
  destinationCodeSchema,
  locationCodeSchema,
  searchRoutesByLocationSchema,
  getAllRoutesSchema
};
