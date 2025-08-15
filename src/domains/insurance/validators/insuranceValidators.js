const Joi = require('joi');

// Validator for creating insurance policy
const createInsuranceValidator = Joi.object({
  policyName: Joi.string().required().trim().min(1).max(200),
  travellerType: Joi.string().required().trim().min(1).max(100),
  policyType: Joi.string().required().trim().min(1).max(100),
  area: Joi.string().required().trim().min(1).max(100),
  restType: Joi.string().required().trim().min(1).max(100),
  productName: Joi.string().required().trim().min(1).max(100),
  ageGroup: Joi.string().required().trim().min(1).max(100),
  country: Joi.string().required().trim().min(1).max(100),
  duration: Joi.string().required().trim().min(1).max(100),
  premium: Joi.number().min(0).max(100000).required(),
  coverageDetails: Joi.string().required().trim().min(10).max(2000),
  termsAndConditions: Joi.string().optional().trim().max(5000)
});

// Validator for updating insurance policy
const updateInsuranceValidator = Joi.object({
  policyName: Joi.string().optional().trim().min(1).max(200),
  travellerType: Joi.string().optional().trim().min(1).max(100),
  policyType: Joi.string().optional().trim().min(1).max(100),
  area: Joi.string().optional().trim().min(1).max(100),
  restType: Joi.string().optional().trim().min(1).max(100),
  productName: Joi.string().optional().trim().min(1).max(100),
  ageGroup: Joi.string().optional().trim().min(1).max(100),
  country: Joi.string().optional().trim().min(1).max(100),
  duration: Joi.string().optional().trim().min(1).max(100),
  premium: Joi.number().min(0).max(100000).optional(),
  coverageDetails: Joi.string().optional().trim().min(10).max(2000),
  termsAndConditions: Joi.string().optional().trim().max(5000)
});

// Validator for searching insurance policies
const searchInsuranceValidator = Joi.object({
  travellerType: Joi.string().optional().trim(),
  policyType: Joi.string().optional().trim(),
  area: Joi.string().optional().trim(),
  country: Joi.string().optional().trim(),
  duration: Joi.string().optional().trim(),
  minPremium: Joi.number().min(0).optional(),
  maxPremium: Joi.number().min(0).optional()
}).custom((value, helpers) => {
  if (value.minPremium && value.maxPremium && value.minPremium > value.maxPremium) {
    return helpers.error('any.invalid', { message: 'minPremium cannot be greater than maxPremium' });
  }
  return value;
});

module.exports = {
  createInsuranceValidator,
  updateInsuranceValidator,
  searchInsuranceValidator
};
