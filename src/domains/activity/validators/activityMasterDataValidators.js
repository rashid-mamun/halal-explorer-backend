const Joi = require('joi');

const fetchCountriesSchema = Joi.object({});

const fetchDestinationsSchema = Joi.object({
  countryCode: Joi.string().required()
});

const fetchCurrenciesSchema = Joi.object({});

const fetchSegmentsSchema = Joi.object({});

const fetchLanguagesSchema = Joi.object({});

const fetchDestinationHotelsSchema = Joi.object({
  destinationCode: Joi.string().required()
});

const searchDestinationsSchema = Joi.object({
  keyword: Joi.string().required(),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const getAllMasterDataSchema = Joi.object({});

const syncAllMasterDataSchema = Joi.object({});

module.exports = {
  fetchCountriesSchema,
  fetchDestinationsSchema,
  fetchCurrenciesSchema,
  fetchSegmentsSchema,
  fetchLanguagesSchema,
  fetchDestinationHotelsSchema,
  searchDestinationsSchema,
  getAllMasterDataSchema,
  syncAllMasterDataSchema
};
