const { getClient } = require("../../config/database");

const saveOrUpdateActivityInfo = async (activityInfo) => {
  try {
    const totalRating = activityInfo.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      return {
        success: false,
        error: 'Total rating exceeds 100',
      };
    }
    const insertActivityInfo = {
      ...activityInfo,
      star_rating: totalRating
    }
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.HALAL_ACTIVITIES_COLLECTION);

    const existingActivity = await collection.findOne({ code: activityInfo.code });

    if (existingActivity) {
      await collection.updateOne({ code: activityInfo.code }, { $set: insertActivityInfo });
    } else {
      // Insert new Activity information
      await collection.insertOne(insertActivityInfo);
    }

    const halalActivitysData = await collection.find().toArray();
    return {
      success: true,
      message: 'Activity information saved/updated successfully',
      data: halalActivitysData,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: 'Failed to save/update Activity information',
    };
  }
};
const saveOrUpdateStructure = async (ActivityInfo) => {
  try {
    const totalRating = ActivityInfo.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      return {
        success: false,
        error: 'Total rating exceeds 100',
      };
    }
    const insertActivityInfo = {
      ...ActivityInfo,
      star_rating: totalRating,
      id: 'structure'
    }
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('halalActivitySturcture');

    const existingActivity = await collection.findOne({ id: 'structure' });

    if (existingActivity) {
      await collection.updateOne({ id: 'structure' }, { $set: insertActivityInfo });
    } else {
      // Insert new Activity information
      await collection.insertOne(insertActivityInfo);
    }

    const halalActivitysData = await collection.find().toArray();
    return {
      success: true,
      message: 'Halal rating structure information saved/updated successfully',
      data: halalActivitysData,
    };
  } catch (err) {
    return {
      success: false,
      error: 'Failed to save/update structure information',
    };
  }
};
const getAllHalalActivityInfo = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.HALAL_ACTIVITIES_COLLECTION);
    const halalActivitysData = await collection.find().toArray();
    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 20;
    const totalActivitys = halalActivitysData.length;

    // Validate page number
    const maxPageNumber = Math.ceil(totalActivitys / pageSize);
    if (pageNumber > maxPageNumber) {
      return {
        success: false,
        message: 'Invalid page number',
      };
    }

    // Calculate the offset and limit
    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const paginatedData = halalActivitysData.slice(offset, offset + limit);
    return {
      success: true,
      message: 'Get Activity information  successfully',
      data: paginatedData,
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to get Activity information',
    };
  }
}
const getHalalActivityInfo = async (code) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.HALAL_ACTIVITIES_COLLECTION);

    const halalActivity = await collection.findOne({ code });

    if (halalActivity) {
      return {
        success: true,
        message: 'Activity information retrieved successfully',
        data: halalActivity,
      };
    }

    return {
      success: false,
      message: 'No halal Activity found with the specified ID',
      error: 'Activity not found',
    };
  } catch (error) {
    console.error('Failed to get Activity information:', error);
    return {
      success: false,
      message: 'Failed to retrieve Activity information',
      error: 'Internal server error',
    };
  }
};
const getHalalRatingStructure = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('halalActivitySturcture');

    const halalActivity = await collection.findOne({ id: 'structure' });

    if (halalActivity) {
      return {
        success: true,
        message: 'Halal rating structure retrieved successfully',
        data: halalActivity,
      };
    }

    return {
      success: false,
      message: 'No Halal rating structure found',
      error: 'Halal rating structure not found',
    };
  } catch (error) {
    console.error('Failed to get Halal rating structure:', error);
    return {
      success: false,
      message: 'Failed to retrieve Halal rating structure',
      error: 'Internal server error',
    };
  }
};



module.exports = {
  saveOrUpdateActivityInfo,
  getHalalActivityInfo,
  getAllHalalActivityInfo,
  saveOrUpdateStructure,
  getHalalRatingStructure
};
