# 🕌 Halal Explorer Backend API

A comprehensive travel and tourism backend API system designed specifically for halal-conscious travelers. The platform integrates multiple travel services including hotels, activities, cruises, holidays, transfers, and insurance, with a special focus on halal compliance and ratings.

## 🏗️ Project Structure

```
halal-explorer-backend/
├── 📁 **Root Configuration**
│   ├── package.json                 # Dependencies and scripts
│   ├── server.js                    # Main server entry point
│   ├── .env.example                 # Environment variables template
│   └── README.md                    # Project documentation
│
├── 📁 **Source Code (`src/`)**
│   ├── 📁 **Core**
│   │   ├── app.js                   # Express app configuration
│   │   ├── routes.js                # Main route aggregator
│   │   └── middleware/              # Global middleware
│   │
│   ├── 📁 **Authentication (`auth/`)**
│   │   ├── controllers/             # Auth controllers
│   │   ├── services/                # Auth business logic
│   │   ├── middleware/              # Auth middleware
│   │   └── routes.js                # Auth routes
│   │
│   ├── 📁 **Services**
│   │   ├── 📁 **Cruise**            # Cruise service module
│   │   ├── 📁 **Insurance**         # Insurance service module
│   │   ├── 📁 **Hotel**             # Hotel service module (planned)
│   │   ├── 📁 **Activity**          # Activity service module (planned)
│   │   ├── 📁 **Holiday**           # Holiday service module (planned)
│   │   └── 📁 **Transfers**         # Transfers service module (planned)
│   │
│   ├── 📁 **Models**                # Mongoose models
│   ├── 📁 **Config**                # Configuration files
│   └── 📁 **Utils**                 # Utility functions
│
├── 📁 **Tests**
│   ├── setup.js                     # Test configuration
│   ├── 📁 **Unit Tests**
│   │   ├── 📁 **auth**              # Authentication unit tests
│   │   └── 📁 **services**          # Service unit tests
│   └── 📁 **Integration Tests**
│       ├── 📁 **auth**              # Authentication integration tests
│       └── 📁 **services**          # Service integration tests
│
└── 📁 **Documentation**
    ├── API_DOCUMENTATION.md         # API endpoints documentation
    ├── DEPLOYMENT_GUIDE.md          # Deployment instructions
    └── DEVELOPMENT_GUIDE.md         # Development setup guide
```

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (RBAC) with hierarchical roles
- **Permission-based authorization** for fine-grained access control
- **Service-based access control** for module-specific permissions
- **Secure password hashing** with bcrypt
- **Token refresh mechanism** for seamless user experience

### 🛳️ Cruise Services
- **Comprehensive cruise management** with detailed information
- **Halal rating system** for cruise compliance
- **Advanced search and filtering** by destination, date, price, etc.
- **Cabin type management** with availability tracking
- **Featured cruises** for promotional purposes
- **Multi-destination support** with detailed itineraries

### 🛡️ Insurance Services
- **Multiple insurance types** (travel, health, life, property, vehicle, business)
- **Halal compliance tracking** with certification and ratings
- **Comprehensive coverage details** with itemized limits
- **Premium calculation** with multiple frequency options
- **Provider management** with contact information
- **Document management** for policies and certificates

### 🏗️ Architecture Principles
- **Clean Code Architecture** with separation of concerns
- **Functional Programming** approach for better testability
- **No hardcoded values** - all constants in dedicated files
- **Comprehensive error handling** with standardized responses
- **Input validation** with detailed error messages
- **Database optimization** with proper indexing
- **Security best practices** throughout the application

## 🛠️ Technology Stack

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi schema validation
- **Testing**: Jest with Supertest
- **Logging**: Winston
- **Caching**: Redis (planned)
- **File Upload**: Multer (planned)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd halal-explorer-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/halal-explorer

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_REFRESH_SECRET_KEY=your-super-secret-refresh-key
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Types
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Database Setup
The tests use a separate test database. Make sure MongoDB is running and the test database is accessible.

## 📚 API Documentation

### Authentication Endpoints

#### Public Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/health` - Health check

#### Protected Endpoints
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password

### Cruise Endpoints

#### Public Endpoints
- `GET /cruise` - Get all cruises with filtering
- `GET /cruise/featured` - Get featured cruises
- `GET /cruise/:cruiseId` - Get cruise by ID
- `GET /cruise/search/destination/:destination` - Search by destination
- `GET /cruise/search/date-range` - Search by date range
- `GET /cruise/halal` - Get halal-rated cruises

#### Protected Endpoints (Admin/Manager)
- `POST /cruise` - Create new cruise
- `PUT /cruise/:cruiseId` - Update cruise
- `DELETE /cruise/:cruiseId` - Delete cruise

### Insurance Endpoints

#### Public Endpoints
- `GET /insurance` - Get all insurance with filtering
- `GET /insurance/featured` - Get featured insurance
- `GET /insurance/:insuranceId` - Get insurance by ID
- `GET /insurance/type/:type` - Get insurance by type
- `GET /insurance/halal` - Get halal insurance
- `GET /insurance/search/provider/:provider` - Search by provider
- `GET /insurance/search/price-range` - Search by price range

#### Protected Endpoints (Admin/Manager)
- `POST /insurance` - Create new insurance
- `PUT /insurance/:insuranceId` - Update insurance
- `DELETE /insurance/:insuranceId` - Delete insurance

## 🔐 Authentication

### User Roles
1. **Super Administrator** - Full system access
2. **Administrator** - Management access to all services
3. **Manager** - Service-specific management
4. **Employee** - Limited operational access
5. **Customer** - Basic user access

### Permissions
The system uses a comprehensive permission system covering:
- User management
- Service management (hotel, cruise, insurance, etc.)
- Booking management
- Analytics and reporting
- System configuration

### JWT Token Usage
```bash
# Include token in request headers
Authorization: Bearer <your-access-token>
```

## 🏗️ Development

### Code Style
- Follow ESLint configuration
- Use functional programming approach
- Write comprehensive tests
- Document all public functions
- Use meaningful variable and function names

### Adding New Services
1. Create service directory in `src/services/`
2. Implement model, service, controller, and routes
3. Add unit and integration tests
4. Update main routes file
5. Document API endpoints

### Database Models
- Use Mongoose schemas with proper validation
- Include indexes for performance
- Implement virtual fields for computed properties
- Add static and instance methods as needed

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB connection
3. Set secure JWT secrets
4. Enable Redis for caching (optional)
5. Configure logging for production
6. Set up monitoring and health checks

### Docker Deployment
```bash
# Build Docker image
docker build -t halal-explorer-backend .

# Run container
docker run -p 5000:5000 halal-explorer-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test examples

## 🔄 Version History

- **v1.0.0** - Initial release with authentication, cruise, and insurance services
- **v1.1.0** - Planned: Hotel and activity services
- **v1.2.0** - Planned: Holiday and transfer services
- **v1.3.0** - Planned: Booking system and analytics

---

**Built with ❤️ for the halal travel community** 