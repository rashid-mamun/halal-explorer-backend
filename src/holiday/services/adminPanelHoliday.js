const { getClient } = require("../../config/database");

const createHolidayPackage = async (data) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('holiday_packages');

    // Save the new holiday package to MongoDB
    await collection.insertOne(data);


    return data;
  } catch (error) {
    throw new Error('Failed to create holiday package.');
  }
};

const updateHolidayPackage = async (id, updatedData) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('holiday_packages');

    // Convert the id to ObjectId (required for querying by _id in MongoDB)
    const objectId = new ObjectId(id);

    // Update the holiday package in MongoDB
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      throw new Error('Holiday package not found or no changes applied.');
    }

    return updatedData;
  } catch (error) {
    throw new Error('Failed to update holiday package.');
  }
};

module.exports = {
  createHolidayPackage,
  updateHolidayPackage,
};
