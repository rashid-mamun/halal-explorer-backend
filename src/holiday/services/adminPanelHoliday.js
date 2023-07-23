const { getClient } = require('../../config/database');

const createHolidayPackage = async (data) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('holiday_packages');
    const result = await collection.insertOne(data);

    return {
      success: true,
      message: 'Holiday package created successfully.',
      data: result.ops[0],
    };
  } catch (error) {
    console.error('Failed to create holiday package:', error);
    return {
      success: false,
      message: 'Failed to create holiday package.',
      error: error.message || 'Unknown error',
    };
  }
};

const updateHolidayPackage = async (id, updatedData) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('holiday_packages');

    const result = await collection.updateOne(
      { id: id },
      { $set: updatedData },
      { returnOriginal: false }
    );
    if (result.matchedCount === 0) {
      console.error('Holiday package not found or no changes applied.');
      return {
        success: false,
        message: 'Holiday package not found or no changes applied.',
      };
    }
    return {
      success: true,
      message: 'Holiday package updated successfully.',
      data: result,
    };
  } catch (error) {
    console.error('Failed to update holiday package:', error);
    return {
      success: false,
      message: 'Failed to update holiday package.',
      error: error.message || 'Unknown error',
    };
  }
};

const getAllHolidayPackages = async () => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('holiday_packages');

    const holidayPackages = await collection.find({}).toArray();
    return {
      success: true,
      message: 'Successfully fetched all holiday packages.',
      data: holidayPackages,
    };
  } catch (error) {
    console.error('Failed to get holiday packages:', error);
    return {
      success: false,
      message: 'Failed to get holiday packages.',
      error: error.message || 'Unknown error',
    };
  }
};

const deleteHolidayPackage = async (id) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('holiday_packages');
    const deleteResult = await collection.deleteOne({ id });
    if (deleteResult.deletedCount === 0) {
      return {
        success: false,
        message: 'Holiday package not found for deletion.',
      };
    }
    return {
      success: true,
      message: 'Holiday package deleted successfully.',
      data: deleteResult,
    };
  } catch (error) {
    console.error('Failed to delete holiday package:', error);
    return {
      success: false,
      message: 'Failed to delete holiday package.',
      error: error.message || 'Unknown error',
    };
  }
};

const searchHolidayPackageById = async (id) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('holiday_packages');
    const holidayPackage = await collection.findOne({ id });
    if (!holidayPackage) {
      return {
        success: false,
        message: 'Holiday package not found.',
      };
    }
    return {
      success: true,
      message: 'Holiday package found successfully.',
      data: holidayPackage,
    };
  } catch (error) {
    console.error('Failed to search for holiday package:', error);
    return {
      success: false,
      message: 'Failed to search for holiday package.',
      error: error.message || 'Unknown error',
    };
  }
};

module.exports = {
  createHolidayPackage,
  updateHolidayPackage,
  getAllHolidayPackages,
  deleteHolidayPackage,
  searchHolidayPackageById,
};
