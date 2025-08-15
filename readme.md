# Halal Explorer Backend

A comprehensive travel booking platform backend with role-based authentication and authorization, supporting hotels, activities, insurance, holidays, cruises, and transfers.

## 🏗️ Architecture

### Domain-Driven Design Structure
```
src/
├── domains/
│   ├── auth/           # Authentication & Authorization
│   ├── hotel/          # Hotel management & bookings
│   ├── activity/       # Activity bookings & content
│   ├── insurance/      # Insurance policies & bookings
│   ├── holiday/        # Holiday packages & bookings
│   ├── cruise/         # Cruise packages & bookings
│   └── transfer/       # Transfer services & bookings
├── shared/             # Shared utilities & constants
└── config/             # Database & app configuration
```

### Technology Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-Based Access Control (RBAC)
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, Rate limiting
- **Caching**: Node-cache for performance
- **External APIs**: RateHawk (Hotels), HotelBeds (Activities/Transfers)

## 🚀 Features

### 🔐 Authentication & Authorization
- **Multi-factor authentication** with email verification
- **Role-based access control** with granular permissions
- **Token blacklisting** and session management
- **Account security** with login attempt tracking
- **Password reset** functionality
- **Device tracking** and session management

### 🏨 Hotel Management
- **Hotel search** and filtering
- **Halal rating system** with custom criteria
- **Booking management** with RateHawk integration
- **Manager profiles** and hotel associations
- **Review system** with detailed ratings

### 🎯 Activity Management
- **Activity search** and availability checking
- **Content management** with HotelBeds integration
- **Booking system** with confirmation workflows
- **Halal activity ratings** and filtering
- **Master data management** for destinations

### 🛡️ Insurance Management
- **Policy management** with configurable types
- **Booking system** with partner integrations
- **Configuration management** for different insurance types
- **Customer data** and booking history

### 🏖️ Holiday Management
- **Package management** with customizable itineraries
- **Booking system** with partner order tracking
- **Custom holiday requests** and management
- **Customer data** and booking history

### 🚢 Cruise Management
- **Cruise package management** with ship and line data
- **Booking system** with enquiry tracking
- **Master data management** for cruise lines and ships
- **Customer enquiry** management

### 🚗 Transfer Management
- **Transfer route management** with location data
- **Availability checking** with real-time updates
- **Booking system** with HotelBeds integration
- **Master data management** for locations and vehicles

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd halal-explorer-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_LOCAL=mongodb://localhost:27017/halal-explorer
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   RATEHAWK_API_KEY=your-ratehawk-api-key
   HOTELBEDS_API_KEY=your-hotelbeds-api-key
   HOTELBEDS_SECRET=your-hotelbeds-secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hotels
- `GET /api/hotel/search` - Search hotels
- `GET /api/hotel/:id` - Get hotel details
- `POST /api/hotel/book` - Book hotel
- `GET /api/hotel/bookings` - Get user bookings

### Activities
- `GET /api/activity/search` - Search activities
- `GET /api/activity/:id` - Get activity details
- `POST /api/activity/book` - Book activity
- `GET /api/activity/bookings` - Get user bookings

### Insurance
- `GET /api/insurance/policies` - Get insurance policies
- `POST /api/insurance/book` - Book insurance
- `GET /api/insurance/bookings` - Get user bookings

### Holidays
- `GET /api/holiday/packages` - Get holiday packages
- `POST /api/holiday/book` - Book holiday
- `GET /api/holiday/bookings` - Get user bookings

### Cruises
- `GET /api/cruise/packages` - Get cruise packages
- `POST /api/cruise/book` - Book cruise
- `GET /api/cruise/bookings` - Get user bookings

### Transfers
- `GET /api/transfer/routes` - Get transfer routes
- `POST /api/transfer/book` - Book transfer
- `GET /api/transfer/bookings` - Get user bookings

## 🔐 Role-Based Access Control

### User Roles
- **Admin**: Full system access
- **Manager**: Domain-specific management
- **Agent**: Booking and customer management
- **Customer**: Basic booking access

### Permissions
- **Resource-based**: `resource:action` pattern
- **Granular control**: Create, Read, Update, Delete operations
- **Service-specific**: Access control per domain
- **Dynamic assignment**: Runtime permission checking

## 🧪 Testing

The project includes comprehensive testing for all modules:

```bash
# Run all tests
npm test

# Run specific module tests
npm run test:hotel
npm run test:activity
npm run test:insurance
npm run test:holiday
npm run test:cruise
npm run test:transfer
```

## 📊 Database Schema

### Core Models
- **User**: Authentication and profile data
- **Role**: Role definitions and permissions
- **Permission**: Granular access control
- **Session**: User session management
- **BlacklistedToken**: Token blacklisting

### Domain Models
- **Hotel**: Hotel information and ratings
- **Activity**: Activity content and bookings
- **Insurance**: Policy and booking data
- **Holiday**: Package and booking information
- **Cruise**: Cruise line and ship data
- **Transfer**: Route and booking management

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Security Headers** with Helmet
- **Input Validation** with Joi schemas
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with content sanitization

## 🚀 Deployment

### Production Setup
1. Set environment variables for production
2. Configure MongoDB connection
3. Set up external API credentials
4. Configure logging and monitoring
5. Set up SSL certificates
6. Configure reverse proxy (nginx)

### Docker Deployment
```bash
# Build Docker image
docker build -t halal-explorer-backend .

# Run container
docker run -p 5000:5000 halal-explorer-backend
```

## 📝 API Documentation

For detailed API documentation, refer to the individual domain documentation or use tools like Swagger/OpenAPI.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.