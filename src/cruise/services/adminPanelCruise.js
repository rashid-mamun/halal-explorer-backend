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

async function getAllCruiseLines() {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('cruise_lines');
    const cruiseLines = await collection.find({}).toArray();

    return {
      success: true,
      data: cruiseLines
    };
  } catch (err) {
    console.error('Failed to get cruise lines:', err);
    return {
      success: false,
      error: 'Failed to get cruise lines.'
    }
  }
}

async function addCruiseLine(cruiseLineData) {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('cruise_lines');

    // Check if a similar package already exists based on certain fields
    const existingPackage = await collection.findOne(cruiseLineData);

    if (existingPackage) {
      return {
        success: false,
        message: 'cruise Line Data already exists with similar details.',
      };
    }
    const result = await collection.insertOne(cruiseLineData);

    if (result.acknowledged && result.insertedId) {
      return {
        success: true,
        message: 'Cruise line added successfully.',
        data: { _id: result.insertedId, ...cruiseLineData },
      };
    } else {
      return {
        success: false,
        error: 'Failed to add cruise line'
      };
    }
  } catch (err) {
    console.error('Failed to add cruise line:', err);
    return {
      success: false,
      message: 'Failed to add cruise line.',
    };
  }
}

async function getAllShipsByCruiseLine(cruiseLine) {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('ships');
    const ships = await collection.find({ cruiseLine }).toArray();

    return {
      success: true,
      data: ships
    };
  } catch (err) {
    console.error('Failed to get ships:', err);
    return {
      success: false,
      error: 'Failed to get ships.'
    }
  }
}

async function addShip(shipData) {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('ships');

    // Check if a similar package already exists based on certain fields
    const existingPackage = await collection.findOne(shipData);

    if (existingPackage) {
      return {
        success: false,
        message: 'shipData already exists with similar details.',
      };
    }
    const result = await collection.insertOne(shipData);

    if (result.acknowledged && result.insertedId) {
      return {
        success: true,
        message: 'Ship added successfully.',
        data: { _id: result.insertedId, ...shipData },
      };
    } else {
      return {
        success: false,
        error: 'Failed to add ship'
      };
    }
  } catch (err) {
    console.error('Failed to add ship:', err);
    return {
      success: false,
      message: 'Failed to add ship.',
    };
  }
}
module.exports = {
  createCruisePackage,
  getAllCruisePackages,
  getAllCruiseLines,
  addCruiseLine,
  getAllShipsByCruiseLine,
  addShip,
};
