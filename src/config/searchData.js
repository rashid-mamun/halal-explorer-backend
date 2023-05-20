const { getClient } = require("./database");

const searchDocuments = async () => {
  try {
    const client = getClient();
    const db = client.db("local");
    const collection = db.collection("projectDb");

    // Find documents that match a query
    const query = { name: "Casa Roberta" }; // Replace with your desired query
    const documents = await collection.find(query).toArray();
    console.log("Documents found:", documents);
  } catch (err) {
    console.log(err);
  }
};

module.exports = searchDocuments;
