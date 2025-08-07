const { APP_CONSTANTS } = require('./constants');

/**
 * Generate pagination parameters
 * @param {number} page - Page number
 * @param {number} pageSize - Page size
 * @returns {Object} Pagination parameters
 */
const getPaginationParams = (page = 1, pageSize = APP_CONSTANTS.DEFAULT_PAGE_SIZE) => {
    const currentPage = Math.max(1, parseInt(page) || 1);
    const limit = Math.min(APP_CONSTANTS.MAX_PAGE_SIZE, Math.max(1, parseInt(pageSize) || APP_CONSTANTS.DEFAULT_PAGE_SIZE));
    const skip = (currentPage - 1) * limit;

    return {
        page: currentPage,
        pageSize: limit,
        skip,
        limit
    };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
const generateRandomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Sanitize object by removing undefined and null values
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
    const sanitized = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null) {
            sanitized[key] = obj[key];
        }
    });
    return sanitized;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
    return obj;
};

/**
 * Check if user has permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
const hasPermission = (user, permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
};

/**
 * Check if user has role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has role
 */
const hasRole = (user, role) => {
    if (!user || !user.role) return false;
    return user.role === role;
};

/**
 * Check if user can access service
 * @param {Object} user - User object
 * @param {string} service - Service to check
 * @returns {boolean} True if user can access service
 */
const canAccessService = (user, service) => {
    if (!user || !user.allowedServices) return false;
    return user.allowedServices.includes(service);
};

/**
 * Get user effective permissions
 * @param {Object} user - User object
 * @param {Object} rolePermissions - Role permissions mapping
 * @returns {Array} Array of effective permissions
 */
const getUserEffectivePermissions = (user, rolePermissions) => {
    if (!user || !user.role) return [];

    const rolePerms = rolePermissions[user.role] || [];
    const customPerms = user.permissions || [];

    return [...new Set([...rolePerms, ...customPerms])];
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date format
 */
const isValidDateFormat = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

/**
 * Check if checkout date is after checkin date
 * @param {string} checkin - Checkin date
 * @param {string} checkout - Checkout date
 * @returns {boolean} True if valid date range
 */
const isValidDateRange = (checkin, checkout) => {
    if (!isValidDateFormat(checkin) || !isValidDateFormat(checkout)) {
        return false;
    }

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    return checkinDate < checkoutDate;
};

/**
 * Validate country code (2 letters)
 * @param {string} countryCode - Country code to validate
 * @returns {boolean} True if valid country code
 */
const isValidCountryCode = (countryCode) => {
    const countryCodeRegex = /^[A-Za-z]{2}$/;
    return countryCodeRegex.test(countryCode);
};

/**
 * Validate currency code (3 letters)
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} True if valid currency code
 */
const isValidCurrencyCode = (currencyCode) => {
    const currencyCodeRegex = /^[A-Za-z]{3}$/;
    return currencyCodeRegex.test(currencyCode);
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Generate search ID
 * @returns {string} Unique search ID
 */
const generateSearchId = () => {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Extract pagination info from query parameters
 * @param {Object} query - Query parameters
 * @returns {Object} Pagination info
 */
const extractPaginationFromQuery = (query) => {
    const { page = 1, pageSize = APP_CONSTANTS.DEFAULT_PAGE_SIZE } = query;
    return getPaginationParams(page, pageSize);
};

/**
 * Build database query with filters
 * @param {Object} filters - Filter criteria
 * @returns {Object} Database query object
 */
const buildQuery = (filters) => {
    const query = {};

    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string' && value.includes('*')) {
                // Handle wildcard search
                const regex = value.replace(/\*/g, '.*');
                query[key] = { $regex: regex, $options: 'i' };
            } else if (Array.isArray(value)) {
                query[key] = { $in: value };
            } else {
                query[key] = value;
            }
        }
    });

    return query;
};

/**
 * Sort array of objects by multiple fields
 * @param {Array} array - Array to sort
 * @param {Array} sortFields - Array of sort field objects
 * @returns {Array} Sorted array
 */
const sortByMultipleFields = (array, sortFields) => {
    return array.sort((a, b) => {
        for (const field of sortFields) {
            const { key, order = 'asc' } = field;
            const aVal = a[key];
            const bVal = b[key];

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
        }
        return 0;
    });
};

module.exports = {
    getPaginationParams,
    isValidEmail,
    isValidPhone,
    generateRandomString,
    sanitizeObject,
    deepClone,
    hasPermission,
    hasRole,
    canAccessService,
    getUserEffectivePermissions,
    isValidDateFormat,
    isValidDateRange,
    isValidCountryCode,
    isValidCurrencyCode,
    formatCurrency,
    generateSearchId,
    extractPaginationFromQuery,
    buildQuery,
    sortByMultipleFields
}; 