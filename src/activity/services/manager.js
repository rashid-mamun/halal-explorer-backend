const { getClient } = require("../../config/database");
const axios = require('axios');
const btoa = require('btoa');

const saveOrUpdateManagerInfo = async (managerInfo) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityManagerInfo');

    const existingManager = await collection.findOne({ id: managerInfo.id });

    if (existingManager) {
      await collection.updateOne({ id: managerInfo.id }, { $set: managerInfo });
    } else {
      // Insert new manager information
      await collection.insertOne(managerInfo);
    }

    const managersData = await collection.find().toArray();
    return {
      success: true,
      message: 'Manager information saved/updated successfully',
      data: managersData,
    };
  } catch (error) {
    console.error('Failed to save/update manager information:', error);
    return {
      success: false,
      error: 'Failed to save/update manager information',
    };
  }
};

const getAllManagerInfo = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityManagerInfo');
    const managersData = await collection.find().toArray();
    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 100;
    const totalManagers = managersData.length;

    // Validate page number
    const maxPageNumber = Math.ceil(totalManagers / pageSize);
    if (pageNumber > maxPageNumber) {
      return {
        success: false,
        message: 'Invalid page number',
      };
    }

    // Calculate the offset and limit
    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const paginatedData = managersData.slice(offset, offset + limit);
    return {
      success: true,
      message: 'Get manager information successfully',
      data: paginatedData,
    };
  } catch (error) {
    console.error('Failed to get manager information:', error);
    return {
      success: false,
      error: 'Failed to get manager information',
    };
  }
};

const getManagerInfo = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityManagerInfo');
    const manager = await collection.findOne({ id: req.id });

    if (manager) {
      return {
        success: true,
        message: 'Manager information retrieved successfully',
        data: manager,
      };
    } else {
      return {
        success: false,
        message: 'No manager found with the specified ID',
        error: 'Manager not found',
      };
    }
  } catch (error) {
    console.error('Failed to get manager information:', error);
    return {
      success: false,
      message: 'Failed to retrieve manager information',
      error: 'Internal server error',
    };
  }
};
const searchHalalManagerActivities = async (req) => {
  try {

    const keyword = req.city || req.hotelName

    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityInfo');
    const halalHotelcollection = db.collection(process.env.HALAL_ACTIVITIES_COLLECTION);
    const halalHotelsData = await halalHotelcollection.find().toArray();
    const halalHotelsDataObj = halalHotelsData.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    if (keyword === req.city) {
      await createAddressIndexIfNotExists(collection);
    }
    else {
      await createNameIndexIfNotExists(collection);
    }


    const query = { $text: { $search: keyword } };
    const projection = { address: 1 };
    const cursor = collection.find(query, projection);

    const dumbsHotelData = await cursor.toArray();
    // console.log(JSON.stringify(dumbsHotelData));

    const hotelsDataMapping = await getHotelsDataMapping(dumbsHotelData);
    let hotels = Object.values(hotelsDataMapping);
    // console.log(JSON.stringify(hotels));

    hotels.forEach(data => {
      if (halalHotelsDataObj[data.id]) {
        data.halalRatingInfo = halalHotelsDataObj[data.id];
      }
    });

    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 100;
    const totalHotels = hotels.length;

    if (totalHotels == 0) {
      return {
        success: false,
        message: 'Hotel Not Found'
      }
    }

    // Validate page number
    const maxPageNumber = Math.ceil(totalHotels / pageSize);
    if (pageNumber > maxPageNumber) {
      return {
        success: false,
        message: 'Invalid page number',
      };
    }

    // Calculate the offset and limit
    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const paginatedData = hotels.slice(offset, offset + limit);

    return {
      success: true,
      totalHotels,
      data: paginatedData,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: 'Internal server error',
    };
  }
};
const getHotelsDataMapping = async (cursor) => {
  const hotelsDataMapping = {};

  await cursor.forEach((doc) => {
    const hotelData = mapHotelData(doc);

    hotelsDataMapping[doc.activityCode] = hotelData;

  });

  return hotelsDataMapping;
};
const mapHotelData = (doc) => ({
  activityCode: doc.activityCode,
  address: doc.address,
  name: doc.name,
  contentId: doc.contentId,
  location: doc.location,
});

const createAddressIndexIfNotExists = async (collection) => {

  const nameIndexExists = await collection.indexExists('activityCode_text');
  if (nameIndexExists) {
    console.log("name_text drop index");
    await collection.dropIndex('activityCode_text');
  }

  const indexExists = await collection.indexExists('address_text');

  if (!indexExists) {
    const addressIndexExists = await collection.indexExists('address_1');
    if (addressIndexExists) {
      console.log("address_1 drop index");
      await collection.dropIndex('address_1');
    }
    await collection.createIndex({ address: "text" });
  }
};
const createNameIndexIfNotExists = async (collection) => {

  const addressIndexExists = await collection.indexExists('address_text');
  if (addressIndexExists) {
    console.log("address_text drop index");
    await collection.dropIndex('address_text');
  }

  const indexExists = await collection.indexExists('activityCode_text');

  if (!indexExists) {

    const nameIndexExists = await collection.indexExists('activityCode_1');
    if (nameIndexExists) {
      console.log("activityCode_1 drop index");
      await collection.dropIndex('activityCode_1');
    }

    await collection.createIndex({ activityCode: "text" });

  }
};


module.exports = {
  saveOrUpdateManagerInfo,
  getManagerInfo,
  getAllManagerInfo,
  searchHalalManagerActivities,
};
