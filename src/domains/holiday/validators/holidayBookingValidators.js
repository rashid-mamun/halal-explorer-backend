const Joi = require('joi');

// Validator for creating holiday booking
const createHolidayBookingValidator = Joi.object({
  bookingId: Joi.string().optional().trim().max(100),
  partnerOrderId: Joi.string().optional().trim().max(100),
  packageId: Joi.string().required().trim().min(1).max(100),
  packageName: Joi.string().optional().trim().max(200),
  email: Joi.string().email().optional().trim().max(100),
  departureDetails: Joi.object({
    departureDate: Joi.date().greater('now').required()
  }).required(),
  passengersDetails: Joi.object({
    adults: Joi.number().integer().min(0).max(20).required(),
    single: Joi.number().integer().min(0).max(20).required(),
    child: Joi.number().integer().min(0).max(20).required(),
    infant: Joi.number().integer().min(0).max(20).required()
  }).required(),
  contractDetails: Joi.object({
    firstName: Joi.string().required().trim().min(1).max(50),
    lastName: Joi.string().required().trim().min(1).max(50),
    email: Joi.string().email().required().trim().max(100),
    nationality: Joi.string().required().trim().min(1).max(100),
    emirates: Joi.string().optional().trim().max(100),
    address: Joi.string().required().trim().min(10).max(500)
  }).required(),
  consultantName: Joi.string().optional().trim().max(100),
  bookingSummary: Joi.object({
    bookingFee: Joi.number().min(0).max(100000).required(),
    total: Joi.number().min(0).max(1000000).required()
  }).required(),
  paymentDetails: Joi.object().required(),
  orderInfo: Joi.object().required()
});

// Validator for updating holiday booking
const updateHolidayBookingValidator = Joi.object({
  packageId: Joi.string().optional().trim().min(1).max(100),
  packageName: Joi.string().optional().trim().max(200),
  departureDetails: Joi.object({
    departureDate: Joi.date().greater('now').required()
  }).optional(),
  passengersDetails: Joi.object({
    adults: Joi.number().integer().min(0).max(20).required(),
    single: Joi.number().integer().min(0).max(20).required(),
    child: Joi.number().integer().min(0).max(20).required(),
    infant: Joi.number().integer().min(0).max(20).required()
  }).optional(),
  contractDetails: Joi.object({
    firstName: Joi.string().required().trim().min(1).max(50),
    lastName: Joi.string().required().trim().min(1).max(50),
    email: Joi.string().email().required().trim().max(100),
    nationality: Joi.string().required().trim().min(1).max(100),
    emirates: Joi.string().optional().trim().max(100),
    address: Joi.string().required().trim().min(10).max(500)
  }).optional(),
  consultantName: Joi.string().optional().trim().max(100),
  bookingSummary: Joi.object({
    bookingFee: Joi.number().min(0).max(100000).required(),
    total: Joi.number().min(0).max(1000000).required()
  }).optional(),
  paymentDetails: Joi.object().optional(),
  orderInfo: Joi.object().optional()
});

// Validator for searching holiday bookings
const searchHolidayBookingValidator = Joi.object({
  email: Joi.string().email().optional().trim(),
  packageId: Joi.string().optional().trim(),
  packageName: Joi.string().optional().trim(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  minTotal: Joi.number().min(0).optional(),
  maxTotal: Joi.number().min(0).optional()
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    return helpers.error('any.invalid', { message: 'startDate cannot be greater than endDate' });
  }
  if (value.minTotal && value.maxTotal && value.minTotal > value.maxTotal) {
    return helpers.error('any.invalid', { message: 'minTotal cannot be greater than maxTotal' });
  }
  return value;
});

module.exports = {
  createHolidayBookingValidator,
  updateHolidayBookingValidator,
  searchHolidayBookingValidator
};
