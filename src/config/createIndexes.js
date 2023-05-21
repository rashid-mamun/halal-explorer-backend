const createIndexes = async (client) => {
    try {
      const db = client.db("projectDb");
      const collection = db.collection("halalDb");
  
      // Create indexes on specified fields
      await collection.createIndex({ name: 1 });
      await collection.createIndex({ address: 1 });
      await collection.createIndex({ amenities: 1 });
      await collection.createIndex({ policies: 1 });
      await collection.createIndex({ region: 1 });
  
      console.log("Indexes created successfully");
    } catch (err) {
      console.log(err);
    }
  };
  
  module.exports = createIndexes;
  