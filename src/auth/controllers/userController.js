const userService = require('../services/userService');
const {
    APP_CONSTANTS,
    ERROR_MESSAGES
} = require('../../utils/constants');
const {
    sendSuccessResponse,
    sendErrorResponse
} = require('../../utils/response');

/**
 * Get all users with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
    try {
        const query = req.query;
        const result = await userService.getAllUsers(query);

        if (result.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                result.message,
                result.errorCode,
                result.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            result.message,
            result.data
        );

    } catch (error) {
        console.error('Get all users error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'GET_USERS_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await userService.getUserById(userId);

        if (result.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                result.message,
                result.errorCode,
                result.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            result.message,
            result.data
        );

    } catch (error) {
        console.error('Get user by ID error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'GET_USER_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Update user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        const result = await userService.updateUserById(userId, updateData);

        if (result.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                result.message,
                result.errorCode,
                result.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            result.message,
            result.data
        );

    } catch (error) {
        console.error('Update user by ID error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'UPDATE_USER_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Delete user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await userService.deleteUserById(userId);

        if (result.status === APP_CONSTANTS.ERROR_STATUS) {
            return sendErrorResponse(
                res,
                result.message,
                result.errorCode,
                result.statusCode
            );
        }

        return sendSuccessResponse(
            res,
            result.message
        );

    } catch (error) {
        console.error('Delete user by ID error:', error);
        return sendErrorResponse(
            res,
            ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR,
            'DELETE_USER_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}; 