const Joi = require('joi');
const AppError = require('../../../utils/appError');

const hotelSearchSchema = Joi.object({
    city: Joi.string().required(),
    checkin: Joi.string().required(),
    checkout: Joi.string().required(),
    guests: Joi.string().required(),
    currency: Joi.string().required(),
    residency: Joi.string().required(),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(100),
});

const hotelSearchFilterSchema = Joi.object({
    searchId: Joi.string().required(),
    travellerRating: Joi.string().allow(null),
    amenities: Joi.array().items(Joi.string()).allow(null),
    deals: Joi.array().items(Joi.string()).allow(null),
    halalRating: Joi.string().allow(null),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(100),
});

const hotelSearchDetailsSchema = Joi.object({
    checkin: Joi.string().required(),
    checkout: Joi.string().required(),
    guests: Joi.string().required(),
    currency: Joi.string().required(),
    residency: Joi.string().required(),
    id: Joi.string().required(),
});

const hotelBookSchema = Joi.object({
    book_hash: Joi.string().required(),
    guests: Joi.array().items(
        Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
        })
    ).required(),
    priceDetails: Joi.object().required(),
    paymentDetails: Joi.object().required(),
    orderInfo: Joi.object().required(),
    userInfo: Joi.object().required(),
});

const dumbHotelByIdSchema = Joi.object({
    id: Joi.string().required(),
});

const hotelInfoSchema = Joi.object({
    id: Joi.string().required(),
    ratings: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                rating: Joi.number().required(),
            })
        )
        .min(1)
        .required(),
});

const structureSchema = Joi.object({
    ratings: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                rating: Joi.number().required(),
            })
        )
        .min(1)
        .required(),
});

const getHalalHotelSchema = Joi.object({
    id: Joi.string().required(),
});

const managerInfoSchema = Joi.object({
    managerName: Joi.string().required(),
    email: Joi.string().email().required(),
    id: Joi.string().required(),
});

const searchHalalManagerHotelsSchema = Joi.object({
    city: Joi.string().allow(''),
    hotelName: Joi.string().allow(''),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(100),
}).or('city', 'hotelName');

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new AppError(error.details.map((e) => e.message).join(', '), 400);
    }
};

module.exports = {
    validateHotelSearch: (data) => validate(hotelSearchSchema, data),
    validateHotelSearchFilter: (data) => validate(hotelSearchFilterSchema, data),
    validateHotelSearchDetails: (data) => validate(hotelSearchDetailsSchema, data),
    validateHotelBook: (data) => validate(hotelBookSchema, data),
    validateDumbHotelById: (data) => validate(dumbHotelByIdSchema, data),
    validateHotelInfo: (data) => validate(hotelInfoSchema, data),
    validateStructure: (data) => validate(structureSchema, data),
    validateGetHalalHotel: (data) => validate(getHalalHotelSchema, data),
    validateManagerInfo: (data) => validate(managerInfoSchema, data),
    validateSearchHalalManagerHotels: (data) => validate(searchHalalManagerHotelsSchema, data),
};