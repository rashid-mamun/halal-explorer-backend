const Joi = require('joi');

/**
 * Validation schema for availability data item
 */
const availabilityDataItemSchema = Joi.object({
  id: Joi.string().required(),
  dateTime: Joi.string().isoDate().required()
});

/**
 * Validation schema for checking availability
 */
const checkAvailabilitySchema = Joi.object({
  language: Joi.string().required(),
  adults: Joi.number().integer().min(1).required(),
  children: Joi.number().integer().min(0).required(),
  infants: Joi.number().integer().min(0).required(),
  availabilityData: Joi.array().items(availabilityDataItemSchema).min(1).required()
});

/**
 * Validation schema for request ID parameter
 */
const requestIdSchema = Joi.object({
  requestId: Joi.string().required()
});

/**
 * Validation schema for getting all availability requests
 */
const getAllAvailabilityRequestsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid('pending', 'success', 'failed')
});

module.exports = {
  checkAvailabilitySchema,
  requestIdSchema,
  getAllAvailabilityRequestsSchema
};
