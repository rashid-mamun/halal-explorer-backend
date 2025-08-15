const Joi = require('joi');

// Validator for creating custom holiday booking
const createCustomHolidayBookingValidator = Joi.object({
  idInfo: Joi.object().required(),
  departureDetails: Joi.object().required(),
  passengersDetails: Joi.object().required(),
  contractDetails: Joi.object({
    email: Joi.string().email().required().trim().max(100)
  }).required(),
  consultantName: Joi.string().optional().trim().max(100),
  bookingSummary: Joi.object().required(),
  paymentDetails: Joi.object().required(),
  orderInfo: Joi.object().required()
});

// Validator for updating custom holiday booking
const updateCustomHolidayBookingValidator = Joi.object({
  idInfo: Joi.object().optional(),
  departureDetails: Joi.object().optional(),
  passengersDetails: Joi.object().optional(),
  contractDetails: Joi.object({
    email: Joi.string().email().required().trim().max(100)
  }).optional(),
  consultantName: Joi.string().optional().trim().max(100),
  bookingSummary: Joi.object().optional(),
  paymentDetails: Joi.object().optional(),
  orderInfo: Joi.object().optional()
});

// Validator for searching custom holiday bookings
const searchCustomHolidayBookingValidator = Joi.object({
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
  createCustomHolidayBookingValidator,
  updateCustomHolidayBookingValidator,
  searchCustomHolidayBookingValidator
};
