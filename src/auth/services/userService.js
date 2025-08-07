const User = require('../../models/User');
const {
    APP_CONSTANTS,
    USER_ROLES,
    ROLE_PERMISSIONS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
} = require('../../utils/constants');
const {
    buildSuccessResponse,
    buildErrorResponse
} = require('../../utils/response');
const { isValidEmail, getPaginationParams } = require('../../utils/helpers');

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Creation result
 */
const createUser = async (userData) => {
    try {
        const { email, password, firstName, lastName, role = USER_ROLES.CUSTOMER } = userData;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return buildErrorResponse(
                ERROR_MESSAGES.VALIDATION.MISSING_REQUIRED_FIELDS,
                'MISSING_REQUIRED_FIELDS',
                APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return buildErrorResponse(
                ERROR_MESSAGES.VALIDATION.INVALID_EMAIL_FORMAT,
                'INVALID_EMAIL_FORMAT',
                APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return buildErrorResponse(
                ERROR_MESSAGES.VALIDATION.DUPLICATE_EMAIL,
                'DUPLICATE_EMAIL',
                APP_CONSTANTS.HTTP_STATUS.CONFLICT
            );
        }

        // Set default permissions based on role
        const defaultPermissions = ROLE_PERMISSIONS[role] || [];
        const defaultServices = getDefaultServicesForRole(role);

        // Create user
        const user = new User({
            ...userData,
            permissions: defaultPermissions,
            allowedServices: defaultServices
        });

        await user.save();

        // Return user data without password
        const userResponse = user.getProfile();

        return buildSuccessResponse(
            SUCCESS_MESSAGES.AUTHENTICATION.ACCOUNT_CREATED,
            userResponse,
            APP_CONSTANTS.HTTP_STATUS.CREATED
        );

    } catch (error) {
        console.error('Create user error:', error);

        if (error.code === 11000) {
            return buildErrorResponse(
                ERROR_MESSAGES.VALIDATION.DUPLICATE_EMAIL,
                'DUPLICATE_EMAIL',
                APP_CONSTANTS.HTTP_STATUS.CONFLICT
            );
        }

        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'CREATE_USER_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile result
 */
const getUserProfile = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.NOT_FOUND
            );
        }

        const profile = user.getProfile();
        return buildSuccessResponse('Profile retrieved successfully', profile);

    } catch (error) {
        console.error('Get user profile error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'GET_PROFILE_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Update result
 */
const updateUserProfile = async (userId, updateData) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.NOT_FOUND
            );
        }

        // Remove sensitive fields from update data
        const { password, email, role, permissions, allowedServices, ...safeUpdateData } = updateData;

        // Update user
        Object.assign(user, safeUpdateData);
        await user.save();

        const updatedProfile = user.getProfile();
        return buildSuccessResponse(
            SUCCESS_MESSAGES.AUTHENTICATION.ACCOUNT_UPDATED,
            updatedProfile
        );

    } catch (error) {
        console.error('Update user profile error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'UPDATE_PROFILE_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Password change result
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.NOT_FOUND
            );
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.INVALID_CREDENTIALS,
                'INVALID_CURRENT_PASSWORD',
                APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return buildSuccessResponse(SUCCESS_MESSAGES.AUTHENTICATION.PASSWORD_UPDATED);

    } catch (error) {
        console.error('Change password error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'CHANGE_PASSWORD_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Get all users with pagination
 * @param {Object} query - Query parameters
 * @returns {Promise<Object>} Users list result
 */
const getAllUsers = async (query) => {
    try {
        const { page, pageSize, role, isActive, search } = query;
        const pagination = getPaginationParams(page, pageSize);

        // Build filter query
        const filterQuery = {};

        if (role) {
            filterQuery.role = role;
        }

        if (isActive !== undefined) {
            filterQuery.isActive = isActive === 'true';
        }

        if (search) {
            filterQuery.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get users with pagination
        const users = await User.find(filterQuery)
            .select('-password')
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });

        // Get total count
        const total = await User.countDocuments(filterQuery);

        return buildSuccessResponse(
            'Users retrieved successfully',
            {
                users,
                pagination: {
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    total,
                    totalPages: Math.ceil(total / pagination.pageSize)
                }
            }
        );

    } catch (error) {
        console.error('Get all users error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'GET_USERS_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User result
 */
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.NOT_FOUND
            );
        }

        return buildSuccessResponse('User retrieved successfully', user);

    } catch (error) {
        console.error('Get user by ID error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'GET_USER_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Update user by ID (admin function)
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Update result
 */
const updateUserById = async (userId, updateData) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.NOT_FOUND
            );
        }

        // Update user
        Object.assign(user, updateData);
        await user.save();

        const updatedUser = user.getProfile();
        return buildSuccessResponse(
            SUCCESS_MESSAGES.AUTHENTICATION.ACCOUNT_UPDATED,
            updatedUser
        );

    } catch (error) {
        console.error('Update user by ID error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'UPDATE_USER_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Delete user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Delete result
 */
const deleteUserById = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return buildErrorResponse(
                ERROR_MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
                'USER_NOT_FOUND',
                APP_CONSTANTS.HTTP_STATUS.NOT_FOUND
            );
        }

        // Soft delete by setting isActive to false
        user.isActive = false;
        await user.save();

        return buildSuccessResponse('User deactivated successfully');

    } catch (error) {
        console.error('Delete user error:', error);
        return buildErrorResponse(
            ERROR_MESSAGES.SYSTEM.DATABASE_ERROR,
            'DELETE_USER_ERROR',
            APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Get default services for role
 * @param {string} role - User role
 * @returns {Array} Default services for role
 */
const getDefaultServicesForRole = (role) => {
    const serviceMappings = {
        [USER_ROLES.SUPER_ADMINISTRATOR]: ['hotel', 'activity', 'cruise', 'insurance', 'holiday', 'transfer'],
        [USER_ROLES.ADMINISTRATOR]: ['hotel', 'activity', 'cruise', 'insurance', 'holiday', 'transfer'],
        [USER_ROLES.MANAGER]: ['hotel', 'activity', 'cruise', 'insurance', 'holiday', 'transfer'],
        [USER_ROLES.EMPLOYEE]: ['hotel', 'activity', 'cruise', 'insurance', 'holiday', 'transfer'],
        [USER_ROLES.CUSTOMER]: []
    };

    return serviceMappings[role] || [];
};

module.exports = {
    createUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}; 