const Joi = require('joi');

const createHalalActivityRatingSchema = Joi.object({
  code: Joi.string().required(),
  ratings: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      rating: Joi.number().min(0).max(100).required()
    })
  ).min(1).required()
});

const updateHalalActivityRatingSchema = Joi.object({
  ratings: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      rating: Joi.number().min(0).max(100).required()
    })
  ).min(1).required()
});

const getHalalActivityRatingSchema = Joi.object({
  code: Joi.string().required()
});

const getAllHalalActivityRatingsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const searchHalalActivityRatingsSchema = Joi.object({
  minRating: Joi.number().min(0).max(100).optional(),
  maxRating: Joi.number().min(0).max(100).optional(),
  keyword: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const deleteHalalActivityRatingSchema = Joi.object({
  code: Joi.string().required()
});

const createRatingStructureSchema = Joi.object({
  ratings: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      rating: Joi.number().min(0).max(100).required()
    })
  ).min(1).required()
});

const updateRatingStructureSchema = Joi.object({
  ratings: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      rating: Joi.number().min(0).max(100).required()
    })
  ).min(1).required()
});

const getRatingStructureSchema = Joi.object({});

const deleteRatingStructureSchema = Joi.object({});

const getRatingStatisticsSchema = Joi.object({});

module.exports = {
  createHalalActivityRatingSchema,
  updateHalalActivityRatingSchema,
  getHalalActivityRatingSchema,
  getAllHalalActivityRatingsSchema,
  searchHalalActivityRatingsSchema,
  deleteHalalActivityRatingSchema,
  createRatingStructureSchema,
  updateRatingStructureSchema,
  getRatingStructureSchema,
  deleteRatingStructureSchema,
  getRatingStatisticsSchema
};
