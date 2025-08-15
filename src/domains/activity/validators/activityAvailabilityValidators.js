const Joi = require('joi');

const searchActivitiesSchema = Joi.object({
  destination: Joi.string().required(),
  adult: Joi.number().integer().positive().required(),
  child: Joi.number().integer().min(0).required(),
  departure: Joi.string().required(),
  arrival: Joi.string().required(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const searchFilterActivitiesSchema = Joi.object({
  searchId: Joi.string().required(),
  halalRating: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const searchActivitiesDetailsSchema = Joi.object({
  code: Joi.string().required(),
  adult: Joi.number().integer().positive().required(),
  child: Joi.number().integer().min(0).required(),
  departure: Joi.string().required(),
  arrival: Joi.string().required()
});

const getAvailabilityRequestSchema = Joi.object({
  requestId: Joi.string().required()
});

const getAllAvailabilityRequestsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const updateAvailabilityRequestStatusSchema = Joi.object({
  requestId: Joi.string().required(),
  status: Joi.string().valid('pending', 'success', 'failed').required()
});

const deleteAvailabilityRequestSchema = Joi.object({
  requestId: Joi.string().required()
});

module.exports = {
  searchActivitiesSchema,
  searchFilterActivitiesSchema,
  searchActivitiesDetailsSchema,
  getAvailabilityRequestSchema,
  getAllAvailabilityRequestsSchema,
  updateAvailabilityRequestStatusSchema,
  deleteAvailabilityRequestSchema
};
