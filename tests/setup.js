// Test setup file for Jest
require('dotenv').config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/halal-explorer-test';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';
process.env.JWT_SECRET_KEY = 'test-jwt-secret-key';
process.env.JWT_REFRESH_SECRET_KEY = 'test-jwt-refresh-secret-key';

// Global test timeout
jest.setTimeout(30000);

// Database connection for tests
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');

// Global test utilities
global.testUtils = {
    // Create mock request object
    createMockRequest: (data = {}) => ({
        body: data.body || {},
        query: data.query || {},
        params: data.params || {},
        headers: data.headers || {},
        user: data.user || null
    }),

    // Create mock response object
    createMockResponse: () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    },

    // Create mock next function
    createMockNext: () => jest.fn(),

    // Generate test user data
    generateTestUser: (overrides = {}) => ({
        email: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer',
        ...overrides
    }),

    // Generate test cruise data
    generateTestCruise: (overrides = {}) => ({
        name: 'Test Cruise',
        description: 'A test cruise description',
        cruiseLine: 'Test Cruise Line',
        shipName: 'Test Ship',
        departurePort: 'Test Port',
        arrivalPort: 'Test Arrival Port',
        departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        arrivalDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // 37 days from now
        duration: 7,
        price: 1000,
        currency: 'USD',
        capacity: 100,
        availableCabins: 50,
        cabinTypes: [
            {
                name: 'Standard',
                description: 'Standard cabin',
                price: 1000,
                capacity: 2,
                available: 25
            }
        ],
        amenities: ['WiFi', 'Pool'],
        destinations: [
            {
                name: 'Test Destination',
                country: 'Test Country',
                arrivalDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
                departureDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
                description: 'Test destination description'
            }
        ],
        images: [
            {
                url: 'https://example.com/image.jpg',
                alt: 'Test image',
                isPrimary: true
            }
        ],
        halalRating: 4,
        halalFeatures: ['Halal food', 'Prayer room'],
        isActive: true,
        isFeatured: false,
        tags: ['test'],
        cancellationPolicy: 'Standard cancellation policy',
        termsAndConditions: 'Standard terms and conditions'
    }),

    // Generate test insurance data
    generateTestInsurance: (overrides = {}) => ({
        name: 'Test Insurance',
        description: 'A test insurance policy',
        type: 'travel',
        category: 'International',
        provider: 'Test Provider',
        policyNumber: 'POL-TEST-001',
        coverage: {
            type: 'comprehensive',
            amount: 50000,
            currency: 'USD',
            details: [
                { item: 'Medical', limit: 50000, description: 'Medical coverage' }
            ]
        },
        premium: {
            amount: 150,
            currency: 'USD',
            frequency: 'one_time'
        },
        duration: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            days: 365
        },
        terms: {
            deductible: 100,
            exclusions: ['Pre-existing conditions'],
            conditions: ['Must be under 65 years old'],
            requirements: ['Valid passport required']
        },
        halalCompliance: {
            isHalal: true,
            rating: 4,
            certification: 'Halal Certified',
            features: ['No interest-based payments'],
            notes: 'Fully compliant'
        },
        documents: [
            { name: 'Policy Document', url: 'policy.pdf', type: 'policy', size: 1024 }
        ],
        status: 'active',
        isFeatured: false,
        tags: ['test'],
        contactInfo: {
            phone: '+1-555-0123',
            email: 'test@provider.com',
            website: 'https://testprovider.com'
        }
    }),

    // Clean up database
    cleanupDatabase: async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    },

    // Connect to test database
    connectTestDatabase: async () => {
        try {
            await connectDB();
            console.log('Test database connected');
        } catch (error) {
            console.error('Test database connection failed:', error);
            throw error;
        }
    },

    // Disconnect from test database
    disconnectTestDatabase: async () => {
        try {
            await mongoose.connection.close();
            console.log('Test database disconnected');
        } catch (error) {
            console.error('Test database disconnection failed:', error);
        }
    }
};

// Setup before all tests
beforeAll(async () => {
    try {
        await testUtils.connectTestDatabase();
    } catch (error) {
        console.error('Failed to connect to test database:', error);
        process.exit(1);
    }
});

// Cleanup after all tests
afterAll(async () => {
    await testUtils.disconnectTestDatabase();
});

// Cleanup before each test
beforeEach(async () => {
    await testUtils.cleanupDatabase();
}); 