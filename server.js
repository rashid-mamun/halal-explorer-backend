const app = require("./src/app");
const { connectWithDb } = require("./src/config/database");
const searchDocuments = require("./src/config/searchData");
require("dotenv").config();

const port = process.env.PORT || 5000;

(async () => {
  await connectWithDb();
  // Perform search operation
  await searchDocuments();

  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
})();
