const { getClient } = require("./database");

const searchDocuments = async () => {
  try {
    const client = getClient();
    const db = client.db("local");
    const collection = db.collection("projectDb");

    // Find documents that match a query
    const keyword = "Raoul";
    const query = { address: { $regex: keyword, $options: "i" } };
    const documents = await collection.find(query).toArray();
    console.log("Documents found:", documents);
  } catch (err) {
    console.log(err);
  }
};

module.exports = searchDocuments;
