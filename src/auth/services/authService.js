const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const {
    APP_CONSTANTS,
    USER_ROLES,
    ROLE_PERMISSIONS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
} = require('../../utils/constants');
const {
    buildAuthResponse,
    buildErrorResponse
} = require('../../utils/response');
const { isValidEmail } = require('../../utils/helpers');

/**
 * Generate JWT access token
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
const generateAccessToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions || []
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || APP_CONSTANTS.JWT_ACCESS_TOKEN_EXPIRY
        }
    );
};

/**
 * Generate JWT refresh token
 * @param {Object} user - User object
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        tokenType: 'refresh'
    };

    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || APP_CONSTANTS.JWT_REFRESH_TOKEN_EXPIRY
        }
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secretKey - Secret key for verification
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, secretKey = process.env.JWT_SECRET_KEY) => {
    return jwt.verify(token, secretKey);
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication result
 */
const authenticateUser = async (email, password) => {
    try {
        // Validate email format
        if (!isValidEmail(email)) {
            return buildErrorResponse(
                ERROR_MESSAGES.VALIDATION.INVALID_EMAIL_FORMAT,
                'INVALID_EMAIL_FORMAT',
                APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Check if account is active
        if (!user.isActive) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.ACCOUNT_DEACTIVATED,
                'ACCOUNT_DEACTIVATED',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.INVALID_CREDENTIALS,
                'INVALID_CREDENTIALS',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Update last login
        await user.updateLastLogin();

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Build user data for response
        const userData = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            role: user.role,
            permissions: user.permissions || [],
            allowedServices: user.allowedServices || [],
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            preferences: user.preferences
        };

        return buildAuthResponse(
            SUCCESS_MESSAGES.AUTHENTICATION.LOGIN_SUCCESSFUL,
            accessToken,
            userData,
            refreshToken
        );

    } catch (error) {
        console.error('Authentication error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.AUTHENTICATION.AUTHENTICATION_FAILED,
            'AUTHENTICATION_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - JWT refresh token
 * @returns {Promise<Object>} Token refresh result
 */
const refreshAccessToken = async (refreshToken) => {
    try {
        // Verify refresh token
        const decodedToken = verifyToken(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY
        );

        // Check if token is a refresh token
        if (decodedToken.tokenType !== 'refresh') {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.TOKEN_INVALID,
                'INVALID_TOKEN_TYPE',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Find user by email
        const user = await User.findByEmail(decodedToken.email);
        if (!user || !user.isActive) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user);

        // Build user data
        const userData = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            role: user.role,
            permissions: user.permissions || [],
            allowedServices: user.allowedServices || [],
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            preferences: user.preferences
        };

        return buildAuthResponse(
            SUCCESS_MESSAGES.AUTHENTICATION.TOKEN_REFRESHED,
            newAccessToken,
            userData
        );

    } catch (error) {
        console.error('Token refresh error:', error);

        if (error.name === 'TokenExpiredError') {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.TOKEN_EXPIRED,
                'TOKEN_EXPIRED',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        return buildErrorResponse(
            ERROR_MESSAGES.AUTHENTICATION.TOKEN_INVALID,
            'INVALID_REFRESH_TOKEN',
            APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
        );
    }
};

/**
 * Extract user from request headers
 * @param {Object} headers - Request headers
 * @returns {Promise<Object|null>} User information or null
 */
const extractUserFromHeaders = async (headers) => {
    try {
        const { authorization } = headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return null;
        }

        const accessToken = authorization.split(' ')[1];
        if (!accessToken) {
            return null;
        }

        // Verify access token
        const decodedToken = verifyToken(accessToken);

        // Find user by email
        const user = await User.findByEmail(decodedToken.email);

        if (!user || !user.isActive) {
            return null;
        }

        // Return user information
        return {
            id: user._id,
            email: user.email,
            role: user.role,
            permissions: user.permissions || [],
            allowedServices: user.allowedServices || [],
            isActive: user.isActive,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName
        };

    } catch (error) {
        console.error('Token extraction error:', error);
        return null;
    }
};

/**
 * Validate user permissions
 * @param {Object} user - User object
 * @param {Array} requiredPermissions - Required permissions
 * @returns {boolean} True if user has all required permissions
 */
const validateUserPermissions = (user, requiredPermissions) => {
    if (!user || !user.role) {
        return false;
    }

    const userPermissions = user.permissions || [];
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];

    return requiredPermissions.every(permission =>
        rolePermissions.includes(permission) || userPermissions.includes(permission)
    );
};

/**
 * Validate user role hierarchy
 * @param {Object} user - User object
 * @param {string} minimumRequiredRole - Minimum required role
 * @returns {boolean} True if user has sufficient role level
 */
const validateUserRoleHierarchy = (user, minimumRequiredRole) => {
    if (!user || !user.role) {
        return false;
    }

    const roleHierarchy = {
        [USER_ROLES.SUPER_ADMINISTRATOR]: 5,
        [USER_ROLES.ADMINISTRATOR]: 4,
        [USER_ROLES.MANAGER]: 3,
        [USER_ROLES.EMPLOYEE]: 2,
        [USER_ROLES.CUSTOMER]: 1
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[minimumRequiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
};

/**
 * Validate user service access
 * @param {Object} user - User object
 * @param {Array} requiredServices - Required services
 * @returns {boolean} True if user has access to all required services
 */
const validateUserServiceAccess = (user, requiredServices) => {
    if (!user) {
        return false;
    }

    // Super administrators and administrators have access to all services
    if (user.role === USER_ROLES.SUPER_ADMINISTRATOR || user.role === USER_ROLES.ADMINISTRATOR) {
        return true;
    }

    const userServices = user.allowedServices || [];
    return requiredServices.every(service => userServices.includes(service));
};

/**
 * Get user effective permissions
 * @param {Object} user - User object
 * @returns {Array} Array of effective permissions
 */
const getUserEffectivePermissions = (user) => {
    if (!user || !user.role) {
        return [];
    }

    const rolePerms = ROLE_PERMISSIONS[user.role] || [];
    const customPerms = user.permissions || [];

    return [...new Set([...rolePerms, ...customPerms])];
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    authenticateUser,
    refreshAccessToken,
    extractUserFromHeaders,
    validateUserPermissions,
    validateUserRoleHierarchy,
    validateUserServiceAccess,
    getUserEffectivePermissions
}; 