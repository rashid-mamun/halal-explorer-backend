const { initializeRBAC } = require('./services/seederService');

/**
 * Initialize the authentication system
 */
const initializeAuthSystem = async () => {
  try {
    console.log('🚀 Initializing Authentication System...');
    
    // Initialize RBAC system
    await initializeRBAC();
    
    console.log('✅ Authentication System initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Authentication System:', error);
    throw error;
  }
};

module.exports = {
  initializeAuthSystem
};
