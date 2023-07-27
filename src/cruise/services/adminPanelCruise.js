const { getClient } = require('../../config/database');

async function createCruisePackage(cruisePackageData) {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('cruise_packages');

    // Check if a similar package already exists based on certain fields
    const existingPackage = await collection.findOne(cruisePackageData);

    if (existingPackage) {
      return {
        success: false,
        message: 'Cruise package already exists with similar details.',
      };
    }

    const result = await collection.insertOne(cruisePackageData);

    // Check if the insertion was successful
    if (result.acknowledged && result.insertedId) {
      return {
        success: true,
        message: 'Cruise package saved successfully.',
        data: { _id: result.insertedId, ...cruisePackageData },
      };
    } else {
      return {
        success: false,
        error: 'Failed to save cruise package'
      }
    }
  } catch (err) {
    console.error('Failed to save cruise package:', err);
    return {
      success: false,
      message: 'Failed to save cruise package',
    };
  }
}
async function getAllCruisePackages() {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('cruise_packages');
    const cruisePackages = await collection.find({}).toArray();

    return {
      success: true,
      data: cruisePackages
    };
  } catch (err) {
    console.error('Failed to get cruise packages:', err);
    return {
      success: false,
      error: 'Failed to get cruise packages.'
    }
  }
}
module.exports = {
  createCruisePackage,
  getAllCruisePackages,
};
