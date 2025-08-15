const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Standard success response handler
 */
const sendSuccessResponse = (res, data = null, message = null, statusCode = HTTP_STATUS.OK) => {
  const response = {
    success: true,
    message: message || 'Operation completed successfully',
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
};

/**
 * Standard error response handler
 */
const sendErrorResponse = (res, message = null, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message: message || MESSAGES.ERROR.INTERNAL_ERROR,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

/**
 * Validation error response handler
 */
const sendValidationError = (res, errors) => {
  return sendErrorResponse(
    res,
    MESSAGES.ERROR.VALIDATION_ERROR,
    HTTP_STATUS.BAD_REQUEST,
    errors
  );
};

/**
 * Not found response handler
 */
const sendNotFoundResponse = (res, message = MESSAGES.ERROR.USER_NOT_FOUND) => {
  return sendErrorResponse(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * Unauthorized response handler
 */
const sendUnauthorizedResponse = (res, message = MESSAGES.ERROR.INVALID_CREDENTIALS) => {
  return sendErrorResponse(res, message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Forbidden response handler
 */
const sendForbiddenResponse = (res, message = MESSAGES.ERROR.ACCESS_DENIED) => {
  return sendErrorResponse(res, message, HTTP_STATUS.FORBIDDEN);
};

/**
 * Conflict response handler
 */
const sendConflictResponse = (res, message = MESSAGES.ERROR.EMAIL_ALREADY_EXISTS) => {
  return sendErrorResponse(res, message, HTTP_STATUS.CONFLICT);
};

/**
 * Account locked response handler
 */
const sendAccountLockedResponse = (res, message = MESSAGES.ERROR.ACCOUNT_LOCKED) => {
  return sendErrorResponse(res, message, HTTP_STATUS.LOCKED);
};

/**
 * Paginated response handler
 */
const sendPaginatedResponse = (res, data, pagination, message = null) => {
  const response = {
    success: true,
    message: message || 'Data retrieved successfully',
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: pagination.pages,
      hasNext: pagination.page < pagination.pages,
      hasPrev: pagination.page > 1
    }
  };

  return res.status(HTTP_STATUS.OK).json(response);
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendValidationError,
  sendNotFoundResponse,
  sendUnauthorizedResponse,
  sendForbiddenResponse,
  sendConflictResponse,
  sendAccountLockedResponse,
  sendPaginatedResponse
};
