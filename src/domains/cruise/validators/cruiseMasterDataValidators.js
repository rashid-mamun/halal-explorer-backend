const Joi = require('joi');

// Validator for adding cruise line
const addCruiseLineValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for updating cruise line
const updateCruiseLineValidator = Joi.object({
  name: Joi.string().optional().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for adding ship
const addShipValidator = Joi.object({
  cruiseLine: Joi.string().required().trim().min(1).max(100),
  name: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

// Validator for updating ship
const updateShipValidator = Joi.object({
  cruiseLine: Joi.string().optional().trim().min(1).max(100),
  name: Joi.string().optional().trim().min(1).max(100),
  description: Joi.string().optional().trim().max(500)
});

module.exports = {
  addCruiseLineValidator,
  updateCruiseLineValidator,
  addShipValidator,
  updateShipValidator
};
