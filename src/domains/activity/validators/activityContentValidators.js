const Joi = require('joi');

const createActivityContentSchema = Joi.object({
  activityCode: Joi.string().required(),
  contentId: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().optional(),
  location: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
  }).optional(),
  description: Joi.string().optional(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().optional(),
      type: Joi.string().optional()
    })
  ).optional(),
  categories: Joi.array().items(
    Joi.object({
      code: Joi.string().optional(),
      name: Joi.string().optional()
    })
  ).optional(),
  segments: Joi.array().items(
    Joi.object({
      code: Joi.string().optional(),
      name: Joi.string().optional()
    })
  ).optional()
});

const updateActivityContentSchema = Joi.object({
  contentId: Joi.string().optional(),
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  location: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
  }).optional(),
  description: Joi.string().optional(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().optional(),
      type: Joi.string().optional()
    })
  ).optional(),
  categories: Joi.array().items(
    Joi.object({
      code: Joi.string().optional(),
      name: Joi.string().optional()
    })
  ).optional(),
  segments: Joi.array().items(
    Joi.object({
      code: Joi.string().optional(),
      name: Joi.string().optional()
    })
  ).optional()
});

const getActivityContentSchema = Joi.object({
  activityCode: Joi.string().required()
});

const getAllActivityContentSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const searchActivityContentSchema = Joi.object({
  keyword: Joi.string().optional(),
  category: Joi.string().optional(),
  segment: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const fetchActivityContentSchema = Joi.object({
  activityCodes: Joi.array().items(Joi.string()).min(1).required(),
  address: Joi.string().required()
});

const getPortfolioDataSchema = Joi.object({
  destination: Joi.string().required(),
  offset: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(10000).default(1000)
});

const getPortfolioAvailabilitySchema = Joi.object({
  destination: Joi.string().required(),
  offset: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(10000).default(1000)
});

module.exports = {
  createActivityContentSchema,
  updateActivityContentSchema,
  getActivityContentSchema,
  getAllActivityContentSchema,
  searchActivityContentSchema,
  fetchActivityContentSchema,
  getPortfolioDataSchema,
  getPortfolioAvailabilitySchema
};
