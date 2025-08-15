const app = require("./src/app");
const { connectWithDb } = require("./src/config/database");
const { initializeAuthSystem } = require("./src/domains/auth/init");
require("dotenv").config();

const port = process.env.PORT || 5000;

(async () => {
  try {
    // Connect to database using Mongoose
    await connectWithDb();
    
    // Initialize authentication system
    await initializeAuthSystem();
    
    // Start server
    app.listen(port, () => {
      console.log("🚀 Server is running on port", port);
      console.log("📚 API Documentation available at /api/auth");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
