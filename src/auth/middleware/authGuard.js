const authService = require('../services/authService');
const {
    APP_CONSTANTS,
    ERROR_MESSAGES
} = require('../../utils/constants');
const { sendErrorResponse } = require('../../utils/response');

/**
 * Authentication middleware
 * Extracts and validates JWT token from request headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateRequest = async (req, res, next) => {
    try {
        const user = await authService.extractUserFromHeaders(req.headers);

        if (!user) {
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
                'TOKEN_REQUIRED',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error('Authentication middleware error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.AUTHENTICATION.TOKEN_INVALID,
            'TOKEN_INVALID',
            APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
        );
    }
};

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const authorizeByRoles = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
                    'TOKEN_REQUIRED',
                    APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
                );
            }

            if (!allowedRoles.includes(user.role)) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHORIZATION.ACCESS_DENIED,
                    'INSUFFICIENT_ROLE',
                    APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
                );
            }

            next();

        } catch (error) {
            console.error('Role authorization error:', error);
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHORIZATION.ACCESS_DENIED,
                'AUTHORIZATION_ERROR',
                APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
            );
        }
    };
};

/**
 * Permission-based authorization middleware
 * @param {Array} requiredPermissions - Array of required permissions
 * @returns {Function} Express middleware function
 */
const authorizeByPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
                    'TOKEN_REQUIRED',
                    APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
                );
            }

            const hasPermission = authService.validateUserPermissions(user, requiredPermissions);

            if (!hasPermission) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHORIZATION.INSUFFICIENT_PERMISSIONS,
                    'INSUFFICIENT_PERMISSIONS',
                    APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
                );
            }

            next();

        } catch (error) {
            console.error('Permission authorization error:', error);
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHORIZATION.ACCESS_DENIED,
                'AUTHORIZATION_ERROR',
                APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
            );
        }
    };
};

/**
 * Service-based authorization middleware
 * @param {Array} requiredServices - Array of required services
 * @returns {Function} Express middleware function
 */
const authorizeByServices = (requiredServices) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
                    'TOKEN_REQUIRED',
                    APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
                );
            }

            const hasServiceAccess = authService.validateUserServiceAccess(user, requiredServices);

            if (!hasServiceAccess) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHORIZATION.SERVICE_ACCESS_DENIED,
                    'SERVICE_ACCESS_DENIED',
                    APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
                );
            }

            next();

        } catch (error) {
            console.error('Service authorization error:', error);
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHORIZATION.ACCESS_DENIED,
                'AUTHORIZATION_ERROR',
                APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
            );
        }
    };
};

/**
 * Role hierarchy authorization middleware
 * @param {string} minimumRequiredRole - Minimum required role level
 * @returns {Function} Express middleware function
 */
const authorizeByRoleHierarchy = (minimumRequiredRole) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
                    'TOKEN_REQUIRED',
                    APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
                );
            }

            const hasSufficientRole = authService.validateUserRoleHierarchy(user, minimumRequiredRole);

            if (!hasSufficientRole) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHORIZATION.INSUFFICIENT_ROLE_LEVEL,
                    'INSUFFICIENT_ROLE_LEVEL',
                    APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
                );
            }

            next();

        } catch (error) {
            console.error('Role hierarchy authorization error:', error);
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHORIZATION.ACCESS_DENIED,
                'AUTHORIZATION_ERROR',
                APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
            );
        }
    };
};

/**
 * Combined role and permission authorization middleware
 * @param {Array} allowedRoles - Array of allowed roles
 * @param {Array} requiredPermissions - Array of required permissions
 * @returns {Function} Express middleware function
 */
const authorizeByRolesAndPermissions = (allowedRoles, requiredPermissions) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
                    'TOKEN_REQUIRED',
                    APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
                );
            }

            // Check role
            if (!allowedRoles.includes(user.role)) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHORIZATION.ACCESS_DENIED,
                    'INSUFFICIENT_ROLE',
                    APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
                );
            }

            // Check permissions
            const hasPermission = authService.validateUserPermissions(user, requiredPermissions);

            if (!hasPermission) {
                return sendErrorResponse(
                    res,
                    ERROR_MESSAGES.AUTHORIZATION.INSUFFICIENT_PERMISSIONS,
                    'INSUFFICIENT_PERMISSIONS',
                    APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
                );
            }

            next();

        } catch (error) {
            console.error('Combined authorization error:', error);
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHORIZATION.ACCESS_DENIED,
                'AUTHORIZATION_ERROR',
                APP_CONSTANTS.HTTP_STATUS.FORBIDDEN
            );
        }
    };
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is present, but doesn't require it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
    try {
        const user = await authService.extractUserFromHeaders(req.headers);

        // Attach user to request object (can be null)
        req.user = user;
        next();

    } catch (error) {
        // Don't fail the request, just set user to null
        req.user = null;
        next();
    }
};

module.exports = {
    authenticateRequest,
    authorizeByRoles,
    authorizeByPermissions,
    authorizeByServices,
    authorizeByRoleHierarchy,
    authorizeByRolesAndPermissions,
    optionalAuth
}; 