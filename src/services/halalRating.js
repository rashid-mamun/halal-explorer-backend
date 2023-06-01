const { getClient } = require("../config/database");

const saveOrUpdateHotelInfo = async (hotelInfo) => {
  try {
    const totalRating = hotelInfo.ratings.reduce((total, rating) => total + rating.rating, 0);
    if (totalRating > 100) {
      return {
        success: false,
        error: 'Total rating exceeds 100',
      };
    }

    const client = getClient();
    const db = client.db(process.env.DbName);
    const collection = db.collection('halalHotels');

    const existingHotel = await collection.findOne({ id: hotelInfo.id });

    if (existingHotel) {
      await collection.updateOne({ id: hotelInfo.id }, { $set: hotelInfo });
    } else {
      // Insert new hotel information
      await collection.insertOne(hotelInfo);
    }

    const halalHotelsData = await collection.find().toArray();
    return {
      success: true,
      message: 'Hotel information saved/updated successfully',
      data: halalHotelsData,
    };
  } catch (err) {
    return {
      success: false,
      error: 'Failed to save/update hotel information',
    };
  }
};

module.exports = {
  saveOrUpdateHotelInfo,
};
