const Joi = require('joi');
const AppError = require('../../../utils/appError');

const getAllDestinationsSchema = Joi.object({
    country: Joi.string().required(),
});

const getPortfolioAvailSchema = Joi.object({
    destination: Joi.string().required(),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(1000),
});

const getPortfolioSchema = Joi.object({
    destination: Joi.string().required(),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(1000),
});

const saveOrUpdateActivitySchema = Joi.object({
    address: Joi.string().required(),
    codes: Joi.array().items(Joi.object({ activityCode: Joi.string().required() })).min(1).required(),
});

const getAllDestinationHotelsSchema = Joi.object({
    destination: Joi.string().required(),
});

const activitySearchSchema = Joi.object({
    destination: Joi.string().required(),
    adult: Joi.number().integer().positive().required(),
    child: Joi.number().integer().min(0).required(),
    departure: Joi.string().required(),
    arrival: Joi.string().required(),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(100),
});

const activitySearchDetailsSchema = Joi.object({
    code: Joi.string().required(),
    adult: Joi.number().integer().positive().required(),
    child: Joi.number().integer().min(0).required(),
    departure: Joi.string().required(),
    arrival: Joi.string().required(),
});

const activitySearchFilterSchema = Joi.object({
    searchId: Joi.string().required(),
    halalRating: Joi.number().integer().min(0).allow(null),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(100),
});

const searchDestinationSchema = Joi.object({
    keyword: Joi.string().required(),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(100).default(10),
});

const activityInfoSchema = Joi.object({
    code: Joi.string().required(),
    ratings: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required(),
    })).min(1).required(),
});

const structureSchema = Joi.object({
    ratings: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required(),
    })).min(1).required(),
});

const getActivitySchema = Joi.object({
    code: Joi.string().required(),
});

const managerInfoSchema = Joi.object({
    managerName: Joi.string().required(),
    email: Joi.string().email().required(),
    id: Joi.string().required(),
});

const searchHalalManagerActivitiesSchema = Joi.object({
    city: Joi.string().allow(''),
    activityName: Joi.string().allow(''),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(100),
}).or('city', 'activityName');

const paxSchema = Joi.object({
    age: Joi.number().min(0).required(),
    name: Joi.string().required(),
    type: Joi.string().valid('ADULT', 'CHILD').required(),
    surname: Joi.string().required(),
});

const activityBookingSchema = Joi.object({
    preferedLanguage: Joi.string().required(),
    serviceLanguage: Joi.string().required(),
    rateKey: Joi.string().required(),
    from: Joi.date().iso().required(),
    to: Joi.date().iso().required(),
    paxes: Joi.array().items(paxSchema).required(),
});

const holderSchema = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    zipCode: Joi.string().required(),
    mailing: Joi.boolean().required(),
    mailUpdDate: Joi.date().iso().required(),
    country: Joi.string().required(),
    surname: Joi.string().required(),
    telephones: Joi.array().items(Joi.string().required()),
});

const bookActivitySchema = Joi.object({
    language: Joi.string().required(),
    clientReference: Joi.string().required(),
    holder: holderSchema.required(),
    activities: Joi.array().items(activityBookingSchema).required(),
});

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new AppError(error.details.map((e) => e.message).join(', '), 400);
    }
};

module.exports = {
    validateGetAllDestinations: (data) => validate(getAllDestinationsSchema, data),
    validateGetPortfolioAvail: (data) => validate(getPortfolioAvailSchema, data),
    validateGetPortfolio: (data) => validate(getPortfolioSchema, data),
    validateSaveOrUpdateActivity: (data) => validate(saveOrUpdateActivitySchema, data),
    validateGetAllDestinationHotels: (data) => validate(getAllDestinationHotelsSchema, data),
    validateActivitySearch: (data) => validate(activitySearchSchema, data),
    validateActivitySearchDetails: (data) => validate(activitySearchDetailsSchema, data),
    validateActivitySearchFilter: (data) => validate(activitySearchFilterSchema, data),
    validateSearchDestination: (data) => validate(searchDestinationSchema, data),
    validateActivityInfo: (data) => validate(activityInfoSchema, data),
    validateStructure: (data) => validate(structureSchema, data),
    validateGetActivity: (data) => validate(getActivitySchema, data),
    validateManagerInfo: (data) => validate(managerInfoSchema, data),
    validateSearchHalalManagerActivities: (data) => validate(searchHalalManagerActivitiesSchema, data),
    validateBookActivity: (data) => validate(bookActivitySchema, data),
};