# Role-Based Authentication and Authorization (RBAC) System

## Overview

This document describes the comprehensive Role-Based Access Control (RBAC) system implemented for the Halal Explorer backend. The system provides secure authentication and granular authorization based on user roles and permissions.

## Architecture

### Domain-Driven Design Structure

```
src/domains/auth/
├── models/
│   ├── User.js          # User schema with authentication fields
│   ├── Role.js          # Role schema for role management
│   └── Permission.js    # Permission schema for granular access control
├── services/
│   ├── authService.js   # Authentication business logic
│   ├── userService.js   # User management business logic
│   └── seederService.js # RBAC initialization and seeding
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── authorization.js # Authorization middleware
├── controllers/
│   └── authController.js # Authentication request handlers
├── routes/
│   └── authRoutes.js    # Authentication API routes
├── init.js              # RBAC system initialization
└── examples/
    └── usageExample.js  # Usage examples for other domains
```

### Shared Components

```
src/shared/
├── constants/
│   └── index.js         # Application-wide constants
├── utils/
│   ├── responseHandler.js # Consistent API response patterns
│   └── validators.js    # Joi validation schemas and middleware
```

## Core Components

### 1. Models

#### User Model (`src/domains/auth/models/User.js`)
- **Purpose**: Defines user schema with authentication fields
- **Key Features**:
  - Email and password authentication
  - Role assignment (multiple roles supported)
  - Account status management (active, locked, pending verification)
  - Login attempt tracking with account locking
  - Email verification and password reset tokens
  - Timestamps for audit trails

#### Role Model (`src/domains/auth/models/Role.js`)
- **Purpose**: Defines role schema for role management
- **Key Features**:
  - Role name and description
  - Permission assignments
  - Service access control
  - Hierarchical role system

#### Permission Model (`src/domains/auth/models/Permission.js`)
- **Purpose**: Defines permission schema for granular access control
- **Key Features**:
  - Resource-action pattern (e.g., `hotel:read`, `activity:create`)
  - Permission description
  - Service association

### 2. Services

#### Auth Service (`src/domains/auth/services/authService.js`)
- **Purpose**: Handles authentication-related business logic
- **Key Functions**:
  - JWT token generation (access and refresh tokens)
  - Password comparison and validation
  - Email verification and password reset token generation
  - Permission and role access checks
  - Service access validation

#### User Service (`src/domains/auth/services/userService.js`)
- **Purpose**: Handles user management business logic
- **Key Functions**:
  - User CRUD operations
  - Password management (hashing, validation)
  - Login attempt tracking
  - Email verification
  - Account locking/unlocking

#### Seeder Service (`src/domains/auth/services/seederService.js`)
- **Purpose**: Initializes RBAC system with default data
- **Key Functions**:
  - Creates default permissions for all services
  - Creates default roles (admin, manager, user)
  - Assigns permissions to roles
  - Creates default admin user

### 3. Middleware

#### Authentication Middleware (`src/domains/auth/middleware/auth.js`)
- **Purpose**: Handles user authentication
- **Key Functions**:
  - `authenticate`: Validates JWT tokens and sets user context
  - `optionalAuth`: Optional authentication for public endpoints
  - `verifyRefreshToken`: Validates refresh tokens

#### Authorization Middleware (`src/domains/auth/middleware/authorization.js`)
- **Purpose**: Handles role-based authorization
- **Key Functions**:
  - `requirePermission`: Checks specific permission
  - `requireResourcePermission`: Checks resource-action permission
  - `requireRole`: Checks user role
  - `requireServiceAccess`: Checks service access permission

### 4. Controllers

#### Auth Controller (`src/domains/auth/controllers/authController.js`)
- **Purpose**: Handles authentication-related HTTP requests
- **Key Endpoints**:
  - User registration and login
  - Token refresh and logout
  - Profile management
  - Password changes and resets
  - Email verification

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Public Endpoints
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /verify-email` - Verify email with token

#### Protected Endpoints
- `POST /logout` - User logout (requires authentication)
- `GET /profile` - Get user profile (requires authentication)
- `PUT /profile` - Update user profile (requires authentication)
- `PUT /change-password` - Change password (requires authentication)
- `POST /resend-verification` - Resend email verification (requires authentication)

## Default Roles and Permissions

### Roles
1. **admin** - Full system access
2. **manager** - Service-specific management access
3. **user** - Basic user access

### Services
- `hotel` - Hotel booking and management
- `activity` - Activity booking and management
- `transfers` - Transfer services
- `insurance` - Insurance services
- `holiday` - Holiday packages
- `cruise` - Cruise services

### Permission Pattern
- `{service}:read` - Read access to service data
- `{service}:create` - Create/booking access
- `{service}:update` - Update access
- `{service}:delete` - Delete access

## Security Features

### 1. JWT Authentication
- Access tokens (short-lived, 15 minutes)
- Refresh tokens (long-lived, 7 days)
- Token blacklisting for logout
- Secure token generation with crypto

### 2. Password Security
- bcrypt hashing with salt rounds
- Password strength validation
- Account locking after failed attempts
- Secure password reset flow

### 3. Account Protection
- Email verification required
- Account locking mechanism
- Login attempt tracking
- Rate limiting on authentication endpoints

### 4. Authorization
- Granular permission-based access control
- Role-based access control
- Service-specific access control
- Resource-action pattern for fine-grained control

## Usage Examples

### Protecting Routes

#### Basic Authentication
```javascript
const { requireAuth } = require('./domains/auth/middleware/auth');

router.get('/protected', requireAuth, (req, res) => {
  // Route logic here
});
```

#### Role-Based Authorization
```javascript
const { requireRoleMiddleware } = require('./domains/auth/middleware/authorization');

router.get('/admin-only', requireRoleMiddleware('admin'), (req, res) => {
  // Admin-only logic here
});
```

#### Permission-Based Authorization
```javascript
const { requireResourcePermissionMiddleware } = require('./domains/auth/middleware/authorization');

router.get('/hotels', requireResourcePermissionMiddleware('hotel', 'read'), (req, res) => {
  // Hotel read logic here
});
```

#### Service Access Control
```javascript
const { requireServiceAccessMiddleware } = require('./domains/auth/middleware/authorization');

router.use('/hotel', requireServiceAccessMiddleware('hotel'), hotelRoutes);
```

### Checking Permissions in Controllers
```javascript
const { hasPermission, hasRole } = require('./domains/auth/services/authService');

// Check specific permission
if (hasPermission(user, 'hotel:create')) {
  // Allow hotel creation
}

// Check role
if (hasRole(user, 'admin')) {
  // Allow admin operations
}
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:auth
npm run test:middleware
npm run test:services
```

### Test Structure
```
src/__tests__/
├── setup.js                    # Test environment setup
├── unit/
│   ├── authService.test.js     # Auth service unit tests
│   ├── userService.test.js     # User service unit tests
│   └── middleware.test.js      # Middleware unit tests
└── integration/
    ├── authRoutes.test.js      # Auth routes integration tests
    └── rbac.test.js           # RBAC system integration tests
```

### Test Features
- **Isolated Database**: Uses `mongodb-memory-server` for isolated testing
- **Mocking**: Comprehensive mocking of external dependencies
- **Coverage**: Full test coverage for all components
- **Integration**: End-to-end testing of authentication flows
- **RBAC Testing**: Comprehensive testing of role-based access control

## Environment Variables

### Required Environment Variables
```env
# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database
MONGODB_URI=mongodb://localhost:27017/halal-explorer

# Email (for verification and password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application
NODE_ENV=development
PORT=3000
```

### Test Environment Variables
```env
# Test-specific variables
NODE_ENV=test
JWT_SECRET=test-jwt-secret
JWT_REFRESH_SECRET=test-refresh-secret
MONGODB_URI=mongodb://localhost:27017/halal-explorer-test
```

## Initialization

### Automatic Initialization
The RBAC system is automatically initialized when the server starts:

```javascript
// server.js
const { initializeAuthSystem } = require('./src/domains/auth/init');

// Initialize RBAC system on server start
initializeAuthSystem()
  .then(() => {
    console.log('RBAC system initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize RBAC system:', error);
  });
```

### Manual Initialization
You can also manually initialize the RBAC system:

```javascript
const { initializeRBAC } = require('./src/domains/auth/services/seederService');

// Initialize default roles and permissions
await initializeRBAC();
```

## Best Practices

### 1. Security
- Always validate user input
- Use HTTPS in production
- Implement rate limiting
- Regularly rotate JWT secrets
- Monitor failed login attempts

### 2. Performance
- Use database indexes for frequently queried fields
- Implement caching for permission checks
- Optimize JWT token size
- Use connection pooling for database

### 3. Maintainability
- Follow the established naming conventions
- Use consistent error handling
- Document new permissions and roles
- Keep tests up to date

### 4. Scalability
- Design for horizontal scaling
- Use stateless authentication
- Implement proper session management
- Consider microservices architecture

## Troubleshooting

### Common Issues

#### 1. JWT Token Expired
- **Cause**: Access token has expired
- **Solution**: Use refresh token to get new access token

#### 2. Permission Denied
- **Cause**: User lacks required permission
- **Solution**: Check user roles and permissions, assign appropriate permissions

#### 3. Account Locked
- **Cause**: Too many failed login attempts
- **Solution**: Wait for lockout period or contact admin

#### 4. Email Not Verified
- **Cause**: User hasn't verified email address
- **Solution**: Resend verification email or verify manually

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=auth:*
```

## Support

For issues and questions:
1. Check the test files for usage examples
2. Review the middleware implementation
3. Check the service layer for business logic
4. Verify environment variables are set correctly

## Changelog

### Version 1.0.0
- Initial RBAC system implementation
- JWT-based authentication
- Role and permission management
- Comprehensive testing suite
- Integration with existing routes
