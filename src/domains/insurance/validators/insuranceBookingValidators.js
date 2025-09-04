const Joi = require('joi');

// Validator for creating insurance booking
const createBookingValidator = Joi.object({
  policyId: Joi.string().required().trim().min(1).max(100),
  policyName: Joi.string().optional().trim().max(200),
  email: Joi.string().email().required().trim().max(100),
  travellerDetails: Joi.object({
    travellerType: Joi.string().required().trim().min(1).max(100),
    ageGroup: Joi.string().required().trim().min(1).max(100),
    count: Joi.number().min(1).max(10).required()
  }).required(),
  coverageDetails: Joi.object({
    startDate: Joi.date().greater('now').required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    country: Joi.string().required().trim().min(1).max(100)
  }).required(),
  contractDetails: Joi.object({
    firstName: Joi.string().required().trim().min(1).max(50),
    lastName: Joi.string().required().trim().min(1).max(50),
    email: Joi.string().email().required().trim().max(100),
    nationality: Joi.string().required().trim().min(1).max(100),
    address: Joi.string().required().trim().min(10).max(500)
  }).required(),
  bookingSummary: Joi.object({
    premium: Joi.number().min(0).max(100000).required(),
    total: Joi.number().min(0).max(100000).required()
  }).required(),
  paymentDetails: Joi.object().required(),
  orderInfo: Joi.object().required()
});

// Validator for updating insurance booking
const updateBookingValidator = Joi.object({
  policyId: Joi.string().optional().trim().min(1).max(100),
  policyName: Joi.string().optional().trim().max(200),
  email: Joi.string().email().optional().trim().max(100),
  travellerDetails: Joi.object({
    travellerType: Joi.string().optional().trim().min(1).max(100),
    ageGroup: Joi.string().optional().trim().min(1).max(100),
    count: Joi.number().min(1).max(10).optional()
  }).optional(),
  coverageDetails: Joi.object({
    startDate: Joi.date().greater('now').optional(),
    endDate: Joi.date().greater(Joi.ref('startDate')).optional(),
    country: Joi.string().optional().trim().min(1).max(100)
  }).optional(),
  contractDetails: Joi.object({
    firstName: Joi.string().optional().trim().min(1).max(50),
    lastName: Joi.string().optional().trim().min(1).max(50),
    email: Joi.string().email().optional().trim().max(100),
    nationality: Joi.string().optional().trim().min(1).max(100),
    address: Joi.string().optional().trim().min(10).max(500)
  }).optional(),
  bookingSummary: Joi.object({
    premium: Joi.number().min(0).max(100000).optional(),
    total: Joi.number().min(0).max(100000).optional()
  }).optional(),
  paymentDetails: Joi.object().optional(),
  orderInfo: Joi.object().optional()
});

// Validator for searching bookings
const searchBookingValidator = Joi.object({
  email: Joi.string().email().optional().trim(),
  policyId: Joi.string().optional().trim(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  country: Joi.string().optional().trim(),
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
  createBookingValidator,
  updateBookingValidator,
  searchBookingValidator
};
