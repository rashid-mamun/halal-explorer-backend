const Joi = require('joi');
const AppError = require('../../../utils/appError');

const availabilitySchema = Joi.object({
    id: Joi.string().required(),
    dateTime: Joi.string().isoDate().required(),
});

const multipleAvailabilityParamsSchema = Joi.object({
    language: Joi.string().required(),
    adults: Joi.number().integer().min(0).required(),
    children: Joi.number().integer().min(0).required(),
    infants: Joi.number().integer().min(0).required(),
});

const pickupsQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const hotelsQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    countryCodes: Joi.string().allow(''),
    destinationCodes: Joi.string().allow(''),
    codes: Joi.string().allow(''),
    giataCodes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const countriesQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const destinationsQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    countryCodes: Joi.string().allow(''),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const terminalsQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    countryCode: Joi.string().allow(''),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const searchTerminalsQuerySchema = Joi.object({
    keyword: Joi.string().required(),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(100).default(10),
});

const masterCategoriesQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const masterVehiclesQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const masterTransferTypesQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const currenciesQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    language: Joi.string().default('en'),
    codes: Joi.string().allow(''),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const routesQuerySchema = Joi.object({
    fields: Joi.string().default('ALL'),
    destinationCode: Joi.string().required(),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
});

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new AppError(error.details.map((e) => e.message).join(', '), 400);
    }
};

module.exports = {
    validateMultipleAvailabilityParams: (data) => validate(multipleAvailabilityParamsSchema, data),
    validateMultipleAvailabilityBody: (data) => validate(Joi.array().items(availabilitySchema), data),
    validatePickupsQuery: (data) => validate(pickupsQuerySchema, data),
    validateHotelsQuery: (data) => validate(hotelsQuerySchema, data),
    validateCountriesQuery: (data) => validate(countriesQuerySchema, data),
    validateDestinationsQuery: (data) => validate(destinationsQuerySchema, data),
    validateTerminalsQuery: (data) => validate(terminalsQuerySchema, data),
    validateSearchTerminalsQuery: (data) => validate(searchTerminalsQuerySchema, data),
    validateMasterCategoriesQuery: (data) => validate(masterCategoriesQuerySchema, data),
    validateMasterVehiclesQuery: (data) => validate(masterVehiclesQuerySchema, data),
    validateMasterTransferTypesQuery: (data) => validate(masterTransferTypesQuerySchema, data),
    validateCurrenciesQuery: (data) => validate(currenciesQuerySchema, data),
    validateRoutesQuery: (data) => validate(routesQuerySchema, data),
};