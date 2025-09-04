const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-should-be-long-enough';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing-purposes-should-be-long-enough';
process.env.BCRYPT_SALT_ROUNDS = '10';

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  try {
    // Force close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to in-memory database with timeout
    await Promise.race([
      mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 10000)
      )
    ]);
    
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
});

// Cleanup after each test
afterEach(async () => {
  try {
    // Clear all collections after each test except system collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      // Don't clear permissions and roles as they're system data
      if (!['permissions', 'roles'].includes(key)) {
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error('Error in afterEach cleanup:', error);
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    // Force close database connection
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
    
    // Stop in-memory server
    if (mongoServer) {
      try {
        await mongoServer.stop();
      } catch (error) {
        console.error('Error stopping MongoDB server:', error);
      }
    }
    
    console.log('✅ Test database disconnected');
  } catch (error) {
    console.error('❌ Failed to cleanup test database:', error);
  }
});

// Global test timeout
jest.setTimeout(30000);
