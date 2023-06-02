const { getClient } = require("../config/database");
const axios = require('axios');
const btoa = require('btoa');


const searchHalalHotels = async (req) => {
  try {

    const keyword = req.city;
    const client = getClient();
    const db = client.db(process.env.DbName);
    const collection = db.collection(process.env.collectionName);

    await createAddressIndexIfNotExists(collection);
    const query = { $text: { $search: keyword } };
    const projection = { id: 1 };
    const cursor = collection.find(query, projection);

    const dumbsHotelData = await cursor.toArray();
   
    // const hotelIds = hotels.map((hotel) => hotel.id);
    // console.log(JSON.stringify(hotelIds,null,2));
    const hotelsDataMapping = await getHotelsDataMapping(dumbsHotelData);
    let hotels = Object.values(hotelsDataMapping);
    // console.log(JSON.stringify(hotels));

    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 20;
    const totalHotels = hotels.length;

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
  return null; // or any other value that suits your needs
};

const createAddressIndexIfNotExists = async (collection) => {
    const indexExists = await collection.indexExists('address_text');
    if (!indexExists) {
        await collection.createIndex({ address: "text" });
    }
};

module.exports = {
  searchHalalHotels,
};
