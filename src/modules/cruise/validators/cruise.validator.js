const Joi = require('joi');

const keyValueSchema = Joi.object({
    key: Joi.string().required(),
    value: Joi.string().required(),
});

const cruisePackageSchema = Joi.object({
    destination: Joi.string().required(),
    cruiseLine: Joi.string().required(),
    ship: Joi.string().allow(''),
    sailingDates: Joi.array().items(Joi.string().isoDate()).required(),
    length: Joi.string().required(),
    commentForLength: Joi.string().allow(''),
    itinerary: Joi.array().items(keyValueSchema),
    shipFacts: Joi.array().items(keyValueSchema),
    shipInfo: Joi.array().items(keyValueSchema),
    policies: Joi.array().items(keyValueSchema),
    roomTypes: Joi.array().items(keyValueSchema),
    price: Joi.object({ startsFrom: Joi.string().required() }),
    gallery: Joi.array().items(Joi.string().required()),
});

const cruiseLineSchema = Joi.object({
    name: Joi.string().required(),
});

const shipSchema = Joi.object({
    cruiseLine: Joi.string().required(),
    name: Joi.string().required(),
});

const cruiseEnquirySchema = Joi.object({
    name: Joi.string().required(),
    cruiseId: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    guest: Joi.object({
        adult: Joi.number().integer().min(1).required(),
        child: Joi.number().integer().min(0).required(),
    }).required(),
    tickBox: Joi.boolean().required(),
    guestResidency: Joi.string().required(),
    preferredStateroom: Joi.array().items(Joi.string()),
    preferredDate: Joi.string().required(),
    preferredDeparturePort: Joi.string().required(),
});

const cruiseBookingSchema = Joi.object({
    priceDetails: Joi.object().required(),
    paymentDetails: Joi.object().required(),
    orderInfo: Joi.object().required(),
    userInfo: Joi.object().required(),
});

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new AppError(error.details.map((e) => e.message).join(', '), 400);
    }
};

module.exports = {
    validateCruisePackage: (data) => validate(cruisePackageSchema, data),
    validateCruiseLine: (data) => validate(cruiseLineSchema, data),
    validateShip: (data) => validate(shipSchema, data),
    validateCruiseEnquiry: (data) => validate(cruiseEnquirySchema, data),
    validateCruiseBooking: (data) => validate(cruiseBookingSchema, data),
};