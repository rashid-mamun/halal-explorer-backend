const Joi = require('joi');

// Validator for creating cruise booking
const createCruiseBookingValidator = Joi.object({
  userInfo: Joi.object().required(),
  priceDetails: Joi.object().required(),
  paymentDetails: Joi.object().required(),
  orderInfo: Joi.object().required()
});

// Validator for updating cruise booking
const updateCruiseBookingValidator = Joi.object({
  userInfo: Joi.object().optional(),
  priceDetails: Joi.object().optional(),
  paymentDetails: Joi.object().optional(),
  orderInfo: Joi.object().optional()
});

// Validator for searching cruise bookings
const searchCruiseBookingValidator = Joi.object({
  email: Joi.string().email().optional().trim(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    return helpers.error('any.invalid', { message: 'startDate cannot be greater than endDate' });
  }
  return value;
});

module.exports = {
  createCruiseBookingValidator,
  updateCruiseBookingValidator,
  searchCruiseBookingValidator
};
