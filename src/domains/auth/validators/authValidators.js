const Joi = require('joi');

// Validation schemas for authentication
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  roleName: Joi.string().valid('user', 'admin', 'manager').default('user'),
  allowedServices: Joi.array().items(Joi.string().valid('hotel', 'activity', 'insurance', 'holiday', 'cruise', 'transfers')).default([])
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  avatar: Joi.object({
    public_id: Joi.string(),
    url: Joi.string()
  })
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6)
});

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().required().min(6)
});

const requestEmailVerificationSchema = Joi.object({
  email: Joi.string().email().required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  roleName: Joi.string().valid('user', 'admin', 'manager'),
  allowedServices: Joi.array().items(Joi.string().valid('hotel', 'activity', 'insurance', 'holiday', 'cruise', 'transfers')),
  isActive: Joi.boolean()
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  requestEmailVerificationSchema,
  updateUserSchema
};
