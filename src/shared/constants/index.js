// Authentication & Authorization Constants
const AUTH_CONSTANTS = {
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  LOGIN_MAX_ATTEMPTS: 5,
  ACCOUNT_LOCK_DURATION: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  EMAIL_VERIFICATION_EXPIRES: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET_EXPIRES: 10 * 60 * 1000, // 10 minutes
  BCRYPT_SALT_ROUNDS: 12
};

// Role Constants
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer'
};

// Permission Resources
const RESOURCES = {
  HOTEL: 'hotel',
  ACTIVITY: 'activity',
  CRUISE: 'cruise',
  HOLIDAY: 'holiday',
  INSURANCE: 'insurance',
  TRANSFERS: 'transfers',
  USER: 'user',
  BOOKING: 'booking',
  ADMIN: 'admin'
};

// Permission Actions
const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  APPROVE: 'approve',
  REJECT: 'reject'
};

// Service Names
const SERVICES = {
  HOTEL: 'hotel',
  ACTIVITY: 'activity',
  CRUISE: 'cruise',
  HOLIDAY: 'holiday',
  INSURANCE: 'insurance',
  TRANSFERS: 'transfers'
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  INTERNAL_SERVER_ERROR: 500
};

// Response Messages
const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful',
    REGISTER: 'User registered successfully',
    LOGOUT: 'Logout successful',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    PASSWORD_UPDATED: 'Password updated successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_RESET: 'Password reset successfully',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    ROLE_CREATED: 'Role created successfully',
    ROLE_UPDATED: 'Role updated successfully',
    ROLE_DELETED: 'Role deleted successfully',
    PERMISSION_CREATED: 'Permission created successfully',
    PERMISSION_UPDATED: 'Permission updated successfully',
    PERMISSION_DELETED: 'Permission deleted successfully',
    // Hotel specific messages
    HOTELS_FOUND: 'Hotels found successfully',
    HOTELS_FILTERED: 'Hotels filtered successfully',
    HOTEL_DETAILS_FOUND: 'Hotel details found successfully',
    HOTEL_BOOKED: 'Hotel booked successfully',
    BOOKINGS_RETRIEVED: 'Bookings retrieved successfully',
    HOTEL_FOUND: 'Hotel found successfully',
    HALAL_RATING_SAVED: 'Halal rating saved successfully',
    STRUCTURE_SAVED: 'Structure saved successfully',
    HALAL_RATINGS_RETRIEVED: 'Halal ratings retrieved successfully',
    HALAL_RATING_RETRIEVED: 'Halal rating retrieved successfully',
    STRUCTURE_RETRIEVED: 'Structure retrieved successfully',
    HALAL_HOTELS_FOUND: 'Halal hotels found successfully',
    MANAGER_SAVED: 'Manager saved successfully',
    MANAGERS_RETRIEVED: 'Managers retrieved successfully',
    MANAGER_RETRIEVED: 'Manager retrieved successfully',
    MANAGER_HOTELS_FOUND: 'Manager hotels found successfully'
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is temporarily locked due to multiple failed login attempts',
    TOKEN_EXPIRED: 'Token expired',
    TOKEN_INVALID: 'Invalid token',
    REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
    REFRESH_TOKEN_INVALID: 'Invalid refresh token',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    USER_NOT_FOUND: 'User not found',
    ROLE_NOT_FOUND: 'Role not found',
    PERMISSION_NOT_FOUND: 'Permission not found',
    // Hotel specific error messages
    INVALID_DATES: 'Invalid checkin and checkout dates. Please make sure the checkout date is after the checkin date.',
    TOO_MANY_GUESTS: 'Please reduce the number of guests',
    INVALID_COUNTRY_CODE: 'Invalid residency country code. Please provide a valid two-letter country code.',
    INVALID_CURRENCY_CODE: 'Invalid currency code. Please provide a valid three-letter currency code.',
    SEARCH_EXPIRED: 'Search session expired. Please search again.',
    HOTEL_NOT_FOUND: 'Hotel not found',
    BOOKING_FAILED: 'Booking failed',
    RATING_EXCEEDS_LIMIT: 'Total rating exceeds 100',
    FAILED_TO_SAVE_RATING: 'Failed to save/update hotel rating information',
    FAILED_TO_SAVE_STRUCTURE: 'Failed to save/update structure information',
    INVALID_PAGE_NUMBER: 'Invalid page number',
    FAILED_TO_RETRIEVE_RATINGS: 'Failed to retrieve ratings',
    HALAL_RATING_NOT_FOUND: 'Halal rating not found',
    FAILED_TO_RETRIEVE_RATING: 'Failed to retrieve rating',
    STRUCTURE_NOT_FOUND: 'Structure not found',
    FAILED_TO_RETRIEVE_STRUCTURE: 'Failed to retrieve structure',
    FAILED_TO_SAVE_MANAGER: 'Failed to save/update manager information',
    FAILED_TO_RETRIEVE_MANAGERS: 'Failed to retrieve managers',
    MANAGER_NOT_FOUND: 'Manager not found',
    FAILED_TO_RETRIEVE_MANAGER: 'Failed to retrieve manager',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    ACCESS_DENIED: 'Access denied',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
    EMAIL_VERIFICATION_EXPIRED: 'Email verification token expired',
    EMAIL_VERIFICATION_INVALID: 'Invalid email verification token',
    PASSWORD_RESET_EXPIRED: 'Password reset token expired',
    PASSWORD_RESET_INVALID: 'Invalid password reset token',
    OLD_PASSWORD_INVALID: 'Invalid old password'
  }
};

// RateHawk API Configuration
const RATEHAWK_API_CONFIG = {
  BASE_URL: process.env.RATEHAWK_API_BASE_URL || 'https://api.ratehawk.com/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Validation Rules
const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  EMAIL: {
    MAX_LENGTH: 255
  },
  NAME: {
    MAX_LENGTH: 50
  },
  PHONE: {
    MAX_LENGTH: 20
  }
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

module.exports = {
  AUTH_CONSTANTS,
  ROLES,
  RESOURCES,
  ACTIONS,
  SERVICES,
  HTTP_STATUS,
  MESSAGES,
  VALIDATION,
  PAGINATION,
  RATEHAWK_API_CONFIG
};
