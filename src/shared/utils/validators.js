const Joi = require('joi');
const { VALIDATION } = require('../constants');

/**
 * Email validation schema
 */
const emailSchema = Joi.string()
  .email()
  .max(VALIDATION.EMAIL.MAX_LENGTH)
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.max': `Email cannot exceed ${VALIDATION.EMAIL.MAX_LENGTH} characters`,
    'any.required': 'Email is required'
  });

/**
 * Password validation schema
 */
const passwordSchema = Joi.string()
  .min(VALIDATION.PASSWORD.MIN_LENGTH)
  .max(VALIDATION.PASSWORD.MAX_LENGTH)
  .required()
  .messages({
    'string.min': `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`,
    'string.max': `Password cannot exceed ${VALIDATION.PASSWORD.MAX_LENGTH} characters`,
    'any.required': 'Password is required'
  });

/**
 * Name validation schema
 */
const nameSchema = Joi.string()
  .trim()
  .max(VALIDATION.NAME.MAX_LENGTH)
  .required()
  .messages({
    'string.max': `Name cannot exceed ${VALIDATION.NAME.MAX_LENGTH} characters`,
    'any.required': 'Name is required'
  });

/**
 * Phone validation schema
 */
const phoneSchema = Joi.string()
  .trim()
  .max(VALIDATION.PHONE.MAX_LENGTH)
  .pattern(/^[\+]?[1-9][\d]{0,15}$/)
  .optional()
  .messages({
    'string.max': `Phone number cannot exceed ${VALIDATION.PHONE.MAX_LENGTH} characters`,
    'string.pattern.base': 'Please provide a valid phone number'
  });

/**
 * User registration validation schema
 */
const userRegistrationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  role: Joi.string().valid('admin', 'manager', 'employee', 'customer').optional(),
  allowedServices: Joi.array().items(Joi.string().valid('hotel', 'activity', 'cruise', 'holiday', 'insurance', 'transfers')).optional(),
  managerInfo: Joi.object({
    department: Joi.string().optional(),
    employeeId: Joi.string().optional(),
    supervisor: Joi.string().optional()
  }).optional()
});

/**
 * User login validation schema
 */
const userLoginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
});

/**
 * User update validation schema
 */
const userUpdateSchema = Joi.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema,
  role: Joi.string().valid('admin', 'manager', 'employee', 'customer').optional(),
  allowedServices: Joi.array().items(Joi.string().valid('hotel', 'activity', 'cruise', 'holiday', 'insurance', 'transfers')).optional(),
  managerInfo: Joi.object({
    department: Joi.string().optional(),
    employeeId: Joi.string().optional(),
    supervisor: Joi.string().optional()
  }).optional()
});

/**
 * Password update validation schema
 */
const passwordUpdateSchema = Joi.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema
});

/**
 * Password reset request validation schema
 */
const passwordResetRequestSchema = Joi.object({
  email: emailSchema
});

/**
 * Password reset validation schema
 */
const passwordResetSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: passwordSchema
});

/**
 * Email verification validation schema
 */
const emailVerificationSchema = Joi.object({
  token: Joi.string().required()
});

/**
 * Role creation validation schema
 */
const roleCreationSchema = Joi.object({
  name: Joi.string().valid('admin', 'manager', 'employee', 'customer').required(),
  description: Joi.string().required(),
  permissions: Joi.array().items(Joi.string()).required()
});

/**
 * Permission creation validation schema
 */
const permissionCreationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  resource: Joi.string().valid('hotel', 'activity', 'cruise', 'holiday', 'insurance', 'transfers', 'user', 'booking', 'admin').required(),
  action: Joi.string().valid('create', 'read', 'update', 'delete', 'manage', 'approve', 'reject').required()
});

/**
 * Pagination validation schema
 */
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Validate data against schema
 */
const validateData = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { isValid: false, errors, value: null };
  }
  
  return { isValid: true, errors: null, value };
};

/**
 * Validate request body
 */
const validateRequestBody = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, value } = validateData(schema, req.body);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    req.validatedBody = value;
    next();
  };
};

/**
 * Validate request query
 */
const validateRequestQuery = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, value } = validateData(schema, req.query);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    req.validatedQuery = value;
    next();
  };
};

/**
 * Validate request params
 */
const validateRequestParams = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, value } = validateData(schema, req.params);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    req.validatedParams = value;
    next();
  };
};

module.exports = {
  // Schemas
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  passwordUpdateSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  emailVerificationSchema,
  roleCreationSchema,
  permissionCreationSchema,
  paginationSchema,
  
  // Validation functions
  validateData,
  validateRequestBody,
  validateRequestQuery,
  validateRequestParams
};
