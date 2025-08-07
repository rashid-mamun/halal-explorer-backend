const authService = require('../services/authService');
const userService = require('../services/userService');
const {
    APP_CONSTANTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
} = require('../../utils/constants');
const {
    sendSuccessResponse,
    sendErrorResponse,
    sendAuthResponse
} = require('../../utils/response');

/**
 * User login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.VALIDATION.MISSING_REQUIRED_FIELDS,
                'MISSING_FIELDS',
                APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Authenticate user
        const authResult = await authService.authenticateUser(email, password);

        if (authResult.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                authResult.message,
                authResult.errorCode,
                authResult.statusCode
            );
        }

        // Send authentication response
        return sendAuthResponse(
            res,
            authResult.message,
            authResult.data.accessToken,
            authResult.data.user,
            authResult.data.refreshToken
        );

    } catch (error) {
        console.error('Login error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'LOGIN_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * User registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
    try {
        const userData = req.body;

        // Create user
        const createResult = await userService.createUser(userData);

        if (createResult.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                createResult.message,
                createResult.errorCode,
                createResult.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            SUCCESS_MESSAGES.AUTHENTICATION.ACCOUNT_CREATED,
            createResult.data,
            APP_CONSTANTS.HTTP_STATUS.CREATED
        );

    } catch (error) {
        console.error('Registration error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'REGISTRATION_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Refresh access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHENTICATION.TOKEN_REQUIRED,
                'MISSING_REFRESH_TOKEN',
                APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Refresh access token
        const refreshResult = await authService.refreshAccessToken(refreshToken);

        if (refreshResult.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                refreshResult.message,
                refreshResult.errorCode,
                refreshResult.statusCode
            );
        }

        return sendAuthResponse(
            res,
            refreshResult.message,
            refreshResult.data.accessToken,
            refreshResult.data.user
        );

    } catch (error) {
        console.error('Token refresh error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'TOKEN_REFRESH_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Get user profile
        const profileResult = await userService.getUserProfile(user.id);

        if (profileResult.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                profileResult.message,
                profileResult.errorCode,
                profileResult.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            'Profile retrieved successfully',
            profileResult.data
        );

    } catch (error) {
        console.error('Get profile error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'PROFILE_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Update current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const updateData = req.body;

        if (!user) {
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Update user profile
        const updateResult = await userService.updateUserProfile(user.id, updateData);

        if (updateResult.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                updateResult.message,
                updateResult.errorCode,
                updateResult.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            SUCCESS_MESSAGES.AUTHENTICATION.ACCOUNT_UPDATED,
            updateResult.data
        );

    } catch (error) {
        console.error('Update profile error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'UPDATE_PROFILE_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Change user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changePassword = async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!user) {
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED
            );
        }

        if (!currentPassword || !newPassword) {
            return sendErrorResponse(
                res,
                ERROR_MESSAGES.VALIDATION.MISSING_REQUIRED_FIELDS,
                'MISSING_PASSWORD_FIELDS',
                APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Change password
        const changeResult = await userService.changePassword(user.id, currentPassword, newPassword);

        if (changeResult.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                changeResult.message,
                changeResult.errorCode,
                changeResult.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            SUCCESS_MESSAGES.AUTHENTICATION.PASSWORD_UPDATED
        );

    } catch (error) {
        console.error('Change password error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'CHANGE_PASSWORD_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = async (req, res) => {
    try {
        // In a real application, you might want to blacklist the token
        // For now, we'll just return a success response
        return sendSuccessResponse(
            res,
            SUCCESS_MESSAGES.AUTHENTICATION.LOGOUT_SUCCESSFUL
        );

    } catch (error) {
        console.error('Logout error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'LOGOUT_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Health check endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const healthCheck = async (req, res) => {
    return sendSuccessResponse(
        res,
        'Authentication service is healthy',
        {
            service: 'authentication',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        }
    );
};

module.exports = {
    login,
    register,
    refreshToken,
    getProfile,
    updateProfile,
    changePassword,
    logout,
    healthCheck
}; 