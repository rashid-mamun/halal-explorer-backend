const { APP_CONSTANTS } = require('./constants');

/**
 * Build success response
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted success response
 */
const buildSuccessResponse = (message, data = null, statusCode = APP_CONSTANTS.HTTP_STATUS.OK) => ({
    status: APP_CONSTANTS.SUCCESS_STATUS,
    message,
    data,
    timestamp: new Date().toISOString(),
    statusCode
});

/**
 * Build error response
 * @param {string} message - Error message
 * @param {string} errorCode - Error code
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Error details
 * @returns {Object} Formatted error response
 */
const buildErrorResponse = (message, errorCode = 'UNKNOWN_ERROR', statusCode = APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => ({
    status: APP_CONSTANTS.ERROR_STATUS,
    message,
    errorCode,
    statusCode,
    details,
    timestamp: new Date().toISOString()
});

/**
 * Build authentication response
 * @param {string} message - Success message
 * @param {string} accessToken - JWT access token
 * @param {Object} userData - User data
 * @param {string} refreshToken - JWT refresh token
 * @returns {Object} Formatted authentication response
 */
const buildAuthResponse = (message, accessToken, userData, refreshToken = null) => ({
    status: APP_CONSTANTS.SUCCESS_STATUS,
    message,
    data: {
        accessToken,
        user: userData,
        ...(refreshToken && { refreshToken })
    },
    timestamp: new Date().toISOString(),
    statusCode: APP_CONSTANTS.HTTP_STATUS.OK
});

/**
 * Build paginated response
 * @param {string} message - Success message
 * @param {Array} data - Response data
 * @param {number} page - Current page
 * @param {number} pageSize - Page size
 * @param {number} total - Total count
 * @returns {Object} Formatted paginated response
 */
const buildPaginatedResponse = (message, data, page, pageSize, total) => ({
    status: APP_CONSTANTS.SUCCESS_STATUS,
    message,
    data,
    pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
    },
    timestamp: new Date().toISOString(),
    statusCode: APP_CONSTANTS.HTTP_STATUS.OK
});

/**
 * Build validation error response
 * @param {Array} errors - Validation errors
 * @returns {Object} Formatted validation error response
 */
const buildValidationErrorResponse = (errors) => ({
    status: APP_CONSTANTS.ERROR_STATUS,
    message: 'Validation failed',
    errorCode: 'VALIDATION_ERROR',
    statusCode: APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    details: errors,
    timestamp: new Date().toISOString()
});

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @param {number} statusCode - HTTP status code
 */
const sendSuccessResponse = (res, message, data = null, statusCode = APP_CONSTANTS.HTTP_STATUS.OK) => {
    const response = buildSuccessResponse(message, data, statusCode);
    res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {string} errorCode - Error code
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Error details
 */
const sendErrorResponse = (res, message, errorCode = 'UNKNOWN_ERROR', statusCode = APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => {
    const response = buildErrorResponse(message, errorCode, statusCode, details);
    res.status(statusCode).json(response);
};

/**
 * Send authentication response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {string} accessToken - JWT access token
 * @param {Object} userData - User data
 * @param {string} refreshToken - JWT refresh token
 */
const sendAuthResponse = (res, message, accessToken, userData, refreshToken = null) => {
    const response = buildAuthResponse(message, accessToken, userData, refreshToken);
    res.status(APP_CONSTANTS.HTTP_STATUS.OK).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Array} data - Response data
 * @param {number} page - Current page
 * @param {number} pageSize - Page size
 * @param {number} total - Total count
 */
const sendPaginatedResponse = (res, message, data, page, pageSize, total) => {
    const response = buildPaginatedResponse(message, data, page, pageSize, total);
    res.status(APP_CONSTANTS.HTTP_STATUS.OK).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 */
const sendValidationErrorResponse = (res, errors) => {
    const response = buildValidationErrorResponse(errors);
    res.status(APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST).json(response);
};

module.exports = {
    buildSuccessResponse,
    buildErrorResponse,
    buildAuthResponse,
    buildPaginatedResponse,
    buildValidationErrorResponse,
    sendSuccessResponse,
    sendErrorResponse,
    sendAuthResponse,
    sendPaginatedResponse,
    sendValidationErrorResponse
}; 