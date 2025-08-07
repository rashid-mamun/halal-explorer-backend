// Application Constants
const APP_CONSTANTS = {
    // Server Configuration
    DEFAULT_PORT: 5000,
    DEFAULT_HOST: 'localhost',

    // JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRY: '15m',
    JWT_REFRESH_TOKEN_EXPIRY: '7d',
    BCRYPT_SALT_ROUNDS: 12,

    // Cache Configuration
    CACHE_TTL: 3600 * 6, // 6 hours
    CACHE_CHECK_PERIOD: 600, // 10 minutes

    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,

    // File Upload
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],

    // Rate Limiting
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100,

    // Validation
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 128,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 255,
    PHONE_MAX_LENGTH: 20,

    // Database
    MONGODB_CONNECTION_TIMEOUT: 5000,
    MONGODB_SOCKET_TIMEOUT: 45000,
    MONGODB_MAX_POOL_SIZE: 10,

    // Redis
    REDIS_CONNECTION_TIMEOUT: 5000,
    REDIS_RETRY_DELAY: 1000,

    // API Response
    SUCCESS_STATUS: 'success',
    ERROR_STATUS: 'error',
    WARNING_STATUS: 'warning',

    // HTTP Status Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    }
};

// User Roles
const USER_ROLES = {
    SUPER_ADMINISTRATOR: 'super_administrator',
    ADMINISTRATOR: 'administrator',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    CUSTOMER: 'customer'
};

// Permissions
const PERMISSIONS = {
    // User Management
    CREATE_USER_ACCOUNT: 'create_user_account',
    READ_USER_ACCOUNT: 'read_user_account',
    UPDATE_USER_ACCOUNT: 'update_user_account',
    DELETE_USER_ACCOUNT: 'delete_user_account',

    // Service Management
    MANAGE_HOTEL_SERVICES: 'manage_hotel_services',
    MANAGE_ACTIVITY_SERVICES: 'manage_activity_services',
    MANAGE_CRUISE_SERVICES: 'manage_cruise_services',
    MANAGE_INSURANCE_SERVICES: 'manage_insurance_services',
    MANAGE_HOLIDAY_SERVICES: 'manage_holiday_services',
    MANAGE_TRANSFER_SERVICES: 'manage_transfer_services',

    // Booking Management
    CREATE_BOOKING: 'create_booking',
    READ_BOOKING: 'read_booking',
    UPDATE_BOOKING: 'update_booking',
    DELETE_BOOKING: 'delete_booking',
    VIEW_ALL_BOOKINGS: 'view_all_bookings',
    MANAGE_BOOKINGS: 'manage_bookings',

    // Analytics and Reporting
    VIEW_ANALYTICS: 'view_analytics',
    EXPORT_REPORTS: 'export_reports',

    // System Management
    MANAGE_SYSTEM_CONFIGURATION: 'manage_system_configuration',
    VIEW_SYSTEM_STATUS: 'view_system_status',
    MANAGE_CONTENT: 'manage_content'
};

// Services
const SERVICES = {
    HOTEL: 'hotel',
    ACTIVITY: 'activity',
    CRUISE: 'cruise',
    INSURANCE: 'insurance',
    HOLIDAY: 'holiday',
    TRANSFER: 'transfer'
};

// Role Hierarchy
const ROLE_HIERARCHY = {
    [USER_ROLES.SUPER_ADMINISTRATOR]: 5,
    [USER_ROLES.ADMINISTRATOR]: 4,
    [USER_ROLES.MANAGER]: 3,
    [USER_ROLES.EMPLOYEE]: 2,
    [USER_ROLES.CUSTOMER]: 1
};

// Role Permission Mappings
const ROLE_PERMISSIONS = {
    [USER_ROLES.SUPER_ADMINISTRATOR]: Object.values(PERMISSIONS),

    [USER_ROLES.ADMINISTRATOR]: [
        PERMISSIONS.CREATE_USER_ACCOUNT,
        PERMISSIONS.READ_USER_ACCOUNT,
        PERMISSIONS.UPDATE_USER_ACCOUNT,
        PERMISSIONS.MANAGE_HOTEL_SERVICES,
        PERMISSIONS.MANAGE_ACTIVITY_SERVICES,
        PERMISSIONS.MANAGE_CRUISE_SERVICES,
        PERMISSIONS.MANAGE_INSURANCE_SERVICES,
        PERMISSIONS.MANAGE_HOLIDAY_SERVICES,
        PERMISSIONS.MANAGE_TRANSFER_SERVICES,
        PERMISSIONS.VIEW_ALL_BOOKINGS,
        PERMISSIONS.MANAGE_BOOKINGS,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_CONTENT
    ],

    [USER_ROLES.MANAGER]: [
        PERMISSIONS.READ_USER_ACCOUNT,
        PERMISSIONS.UPDATE_USER_ACCOUNT,
        PERMISSIONS.MANAGE_HOTEL_SERVICES,
        PERMISSIONS.MANAGE_ACTIVITY_SERVICES,
        PERMISSIONS.MANAGE_CRUISE_SERVICES,
        PERMISSIONS.MANAGE_INSURANCE_SERVICES,
        PERMISSIONS.MANAGE_HOLIDAY_SERVICES,
        PERMISSIONS.MANAGE_TRANSFER_SERVICES,
        PERMISSIONS.VIEW_ALL_BOOKINGS,
        PERMISSIONS.MANAGE_BOOKINGS,
        PERMISSIONS.VIEW_ANALYTICS
    ],

    [USER_ROLES.EMPLOYEE]: [
        PERMISSIONS.READ_USER_ACCOUNT,
        PERMISSIONS.CREATE_BOOKING,
        PERMISSIONS.MANAGE_BOOKINGS,
        PERMISSIONS.VIEW_ANALYTICS
    ],

    [USER_ROLES.CUSTOMER]: [
        PERMISSIONS.CREATE_BOOKING
    ]
};

// Error Messages
const ERROR_MESSAGES = {
    AUTHENTICATION: {
        TOKEN_REQUIRED: 'Authentication token is required',
        TOKEN_INVALID: 'Invalid authentication token',
        TOKEN_EXPIRED: 'Authentication token has expired',
        USER_NOT_FOUND: 'User account not found',
        ACCOUNT_DEACTIVATED: 'User account is deactivated',
        INVALID_CREDENTIALS: 'Invalid email or password',
        AUTHENTICATION_FAILED: 'Authentication failed'
    },
    AUTHORIZATION: {
        ACCESS_DENIED: 'Access denied',
        INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this operation',
        INSUFFICIENT_ROLE_LEVEL: 'Insufficient role level for this operation',
        SERVICE_ACCESS_DENIED: 'Service access denied',
        UNAUTHORIZED_OPERATION: 'Unauthorized operation'
    },
    VALIDATION: {
        INVALID_INPUT_DATA: 'Invalid input data provided',
        MISSING_REQUIRED_FIELDS: 'Required fields are missing',
        INVALID_EMAIL_FORMAT: 'Invalid email format',
        INVALID_PASSWORD_FORMAT: 'Invalid password format',
        DUPLICATE_EMAIL: 'Email address already exists',
        VALIDATION_FAILED: 'Validation failed',
        INVALID_ID: 'Invalid ID provided'
    },
    SYSTEM: {
        INTERNAL_ERROR: 'Internal server error occurred',
        SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
        DATABASE_ERROR: 'Database operation failed',
        VALIDATION_ERROR: 'Data validation failed',
        HEALTH_CHECK_FAILED: 'Health check failed'
    },
    HOLIDAY: {
        HOLIDAY_NOT_FOUND: 'Holiday package not found',
        HOLIDAY_CREATION_FAILED: 'Failed to create holiday package',
        HOLIDAY_UPDATE_FAILED: 'Failed to update holiday package',
        HOLIDAY_DELETION_FAILED: 'Failed to delete holiday package',
        HOLIDAY_SEARCH_FAILED: 'Failed to search holiday packages'
    }
};

// Success Messages
const SUCCESS_MESSAGES = {
    AUTHENTICATION: {
        LOGIN_SUCCESSFUL: 'Login successful',
        LOGOUT_SUCCESSFUL: 'Logout successful',
        TOKEN_REFRESHED: 'Token refreshed successfully',
        ACCOUNT_CREATED: 'User account created successfully',
        ACCOUNT_UPDATED: 'User account updated successfully',
        PASSWORD_UPDATED: 'Password updated successfully'
    },
    AUTHORIZATION: {
        ACCESS_GRANTED: 'Access granted',
        OPERATION_SUCCESSFUL: 'Operation completed successfully'
    },
    SYSTEM: {
        HEALTH_CHECK: 'Health check completed successfully'
    },
    HOLIDAY: {
        HOLIDAY_CREATED: 'Holiday package created successfully',
        HOLIDAY_UPDATED: 'Holiday package updated successfully',
        HOLIDAY_DELETED: 'Holiday package deleted successfully',
        HOLIDAYS_RETRIEVED: 'Holiday packages retrieved successfully',
        HOLIDAY_RETRIEVED: 'Holiday package retrieved successfully',
        FEATURED_HOLIDAYS_RETRIEVED: 'Featured holiday packages retrieved successfully',
        HOLIDAY_SEARCH_COMPLETED: 'Holiday search completed successfully',
        HOLIDAYS_BY_DATE_RANGE_RETRIEVED: 'Holidays by date range retrieved successfully',
        HOLIDAYS_BY_PRICE_RANGE_RETRIEVED: 'Holidays by price range retrieved successfully',
        HALAL_HOLIDAYS_RETRIEVED: 'Halal holiday packages retrieved successfully',
        // Booking success messages
        BOOKING_CREATED: 'Booking created successfully',
        BOOKING_UPDATED: 'Booking updated successfully',
        BOOKING_DELETED: 'Booking deleted successfully',
        BOOKINGS_RETRIEVED: 'Bookings retrieved successfully',
        BOOKING_RETRIEVED: 'Booking retrieved successfully',
        // Custom booking success messages
        CUSTOM_BOOKING_CREATED: 'Custom booking created successfully',
        CUSTOM_BOOKING_UPDATED: 'Custom booking updated successfully',
        CUSTOM_BOOKING_DELETED: 'Custom booking deleted successfully',
        CUSTOM_BOOKINGS_RETRIEVED: 'Custom bookings retrieved successfully',
        CUSTOM_BOOKING_RETRIEVED: 'Custom booking retrieved successfully'
    }
};

module.exports = {
    APP_CONSTANTS,
    USER_ROLES,
    PERMISSIONS,
    SERVICES,
    ROLE_HIERARCHY,
    ROLE_PERMISSIONS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
}; 