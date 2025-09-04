const { initializeRBAC } = require('./services/seederService');

let isInitialized = false;
let initializationPromise = null;

/**
 * Initialize the authentication system
 */
const initializeAuthSystem = async () => {
  // If already initialized, return immediately
  if (isInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return await initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('🚀 Initializing Authentication System...');
      
      // Initialize RBAC system
      await initializeRBAC();
      
      isInitialized = true;
      console.log('✅ Authentication System initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Authentication System:', error);
      // Reset on error so we can retry
      isInitialized = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return await initializationPromise;
};

/**
 * Reset initialization state (for testing)
 */
const resetInitialization = () => {
  isInitialized = false;
  initializationPromise = null;
};

module.exports = {
  initializeAuthSystem,
  resetInitialization
};
