const Joi = require('joi');
// const AppError = require('../../../utils/appError');

const insuranceSchema = Joi.object({
    name: Joi.string().required(),
    travellerType: Joi.string().required(),
    policyType: Joi.string().required(),
    area: Joi.string().required(),
    restType: Joi.string().required(),
    productName: Joi.string().required(),
    ageGroup: Joi.string().required(),
    country: Joi.string().required(),
    duration: Joi.string().required(),
});

const insuranceBookingSchema = Joi.object({
    email: Joi.string().email().required(),
    userInfo: Joi.object().required(),
    priceDetails: Joi.object().required(),
    paymentDetails: Joi.object().required(),
    orderInfo: Joi.object().required(),
});

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new AppError(error.details.map((e) => e.message).join(', '), 400);
    }
};

module.exports = {
    validateInsurance: (data) => validate(insuranceSchema, data),
    validateInsuranceBooking: (data) => validate(insuranceBookingSchema, data),
};