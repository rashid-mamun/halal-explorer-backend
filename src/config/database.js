const { MongoClient } = require("mongodb");
const createIndexes = require("./createIndexes");

let client = null;

const connectWithDb = async () => {
  try {
    client = new MongoClient("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("Database connected successfully");

    // Create indexes on startup
    await createIndexes(client);
  } catch (err) {
    console.log(err);
  }
};

const getClient = () => client;

module.exports = {
  connectWithDb,
  getClient,
};
