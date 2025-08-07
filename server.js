const app = require("./src/app");
const connectDB = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');
const logger = require('./src/utils/logger');
// const searchDocuments = require("./src/config/searchData");
require("dotenv").config();

const port = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await connectRedis();
  // Perform search operation
  // await searchDocuments();

  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
})();
