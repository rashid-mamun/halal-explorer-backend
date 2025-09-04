const Joi = require('joi');

/**
 * Validation schema for getting categories
 */
const getCategoriesSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for getting vehicles
 */
const getVehiclesSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for getting transfer types
 */
const getTransferTypesSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for getting currencies
 */
const getCurrenciesSchema = Joi.object({
  fields: Joi.string().default('ALL'),
  language: Joi.string().default('en'),
  codes: Joi.string().default(''),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validation schema for searching master data
 */
const searchMasterDataSchema = Joi.object({
  keyword: Joi.string().required().min(1),
  type: Joi.string().valid('categories', 'vehicles', 'transferTypes', 'currencies')
});

/**
 * Validation schema for master data type parameter
 */
const masterDataTypeSchema = Joi.object({
  type: Joi.string().valid('categories', 'vehicles', 'transferTypes', 'currencies').required()
});

module.exports = {
  getCategoriesSchema,
  getVehiclesSchema,
  getTransferTypesSchema,
  getCurrenciesSchema,
  searchMasterDataSchema,
  masterDataTypeSchema
};
