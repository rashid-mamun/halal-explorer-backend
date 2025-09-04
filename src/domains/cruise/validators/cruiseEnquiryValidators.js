const Joi = require('joi');

// Validator for creating cruise enquiry
const createCruiseEnquiryValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  cruiseId: Joi.string().required().trim().min(1).max(100),
  email: Joi.string().email().required().trim().max(100),
  contactNumber: Joi.string().required().trim().min(10).max(20),
  guest: Joi.object({
    adult: Joi.number().integer().min(1).max(20).required(),
    child: Joi.number().integer().min(0).max(20).required()
  }).required(),
  tickBox: Joi.boolean().required(),
  guestResidency: Joi.string().required().trim().min(1).max(100),
  preferredStateroom: Joi.array().items(Joi.string().trim().max(100)).optional(),
  preferredDate: Joi.string().required().trim().min(1).max(50),
  preferredDeparturePort: Joi.string().required().trim().min(1).max(100)
});

// Validator for updating cruise enquiry
const updateCruiseEnquiryValidator = Joi.object({
  name: Joi.string().optional().trim().min(1).max(100),
  cruiseId: Joi.string().optional().trim().min(1).max(100),
  email: Joi.string().email().optional().trim().max(100),
  contactNumber: Joi.string().optional().trim().min(10).max(20),
  guest: Joi.object({
    adult: Joi.number().integer().min(1).max(20).required(),
    child: Joi.number().integer().min(0).max(20).required()
  }).optional(),
  tickBox: Joi.boolean().optional(),
  guestResidency: Joi.string().optional().trim().min(1).max(100),
  preferredStateroom: Joi.array().items(Joi.string().trim().max(100)).optional(),
  preferredDate: Joi.string().optional().trim().min(1).max(50),
  preferredDeparturePort: Joi.string().optional().trim().min(1).max(100)
});

// Validator for searching cruise enquiries
const searchCruiseEnquiryValidator = Joi.object({
  email: Joi.string().email().optional().trim(),
  cruiseId: Joi.string().optional().trim(),
  name: Joi.string().optional().trim(),
  preferredDeparturePort: Joi.string().optional().trim(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    return helpers.error('any.invalid', { message: 'startDate cannot be greater than endDate' });
  }
  return value;
});

module.exports = {
  createCruiseEnquiryValidator,
  updateCruiseEnquiryValidator,
  searchCruiseEnquiryValidator
};
