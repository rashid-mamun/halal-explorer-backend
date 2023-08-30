const { getClient } = require("../../config/database");
const axios = require('axios');
const btoa = require('btoa');

const saveOrUpdateManagerInfo = async (managerInfo) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.MANAGER_INFO_COLLECTION);

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
    const collection = db.collection(process.env.MANAGER_INFO_COLLECTION);
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
    const collection = db.collection(process.env.MANAGER_INFO_COLLECTION);
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
const searchHalalManagerHotels = async (req) => {
  try {

    const keyword = req.city || req.hotelName
   
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DUMB_HOTEL_COLLECTION);
    const halalHotelcollection = db.collection(process.env.HALAL_HOTELS_COLLECTION);
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
    if (hotelData.images.length > 0) {
      hotelsDataMapping[doc.id] = hotelData;
    }
  });

  return hotelsDataMapping;
};
const mapHotelData = (doc) => ({
  hotelName: doc.name,
  address: doc.address,
  id: doc.id,
  latitude: doc.latitude,
  longitude: doc.longitude,
  region: doc.region,
  images: doc.images.length > 0 ? transformImageUrl(doc.images[0], '1024x768') : [],
});
const transformImageUrl = (imageUrl, size) => {
  if (imageUrl) {
    return imageUrl.replace('{size}', size);
  }
  return null;
};
const createAddressIndexIfNotExists = async (collection) => {
  
  const nameIndexExists = await collection.indexExists('name_text');
  if (nameIndexExists) {
    console.log("name_text drop index");
    await collection.dropIndex('name_text');
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

  const indexExists = await collection.indexExists('name_text');
 
  if (!indexExists) {

    const nameIndexExists = await collection.indexExists('name_1');
    if (nameIndexExists) {
      console.log("name_1 drop index");
      await collection.dropIndex('name_1');
    }

    await collection.createIndex({ name: "text" });

  }
};


module.exports = {
  saveOrUpdateManagerInfo,
  getManagerInfo,
  getAllManagerInfo,
  searchHalalManagerHotels,
};
