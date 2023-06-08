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
    const inserthotelInfo = {
      ...hotelInfo,
      star_rating: totalRating
    }
    const client = getClient();
    const db = client.db(process.env.DbName);
    const collection = db.collection('halalHotels');

    const existingHotel = await collection.findOne({ id: hotelInfo.id });

    if (existingHotel) {
      await collection.updateOne({ id: hotelInfo.id }, { $set: inserthotelInfo });
    } else {
      // Insert new hotel information
      await collection.insertOne(inserthotelInfo);
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
const saveOrUpdateStructure = async (hotelInfo) => {
  try {
    const totalRating = hotelInfo.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      return {
        success: false,
        error: 'Total rating exceeds 100',
      };
    }
    const inserthotelInfo = {
      ...hotelInfo,
      star_rating: totalRating,
      id: 'structure'
    }
    const client = getClient();
    const db = client.db(process.env.DbName);
    const collection = db.collection('halalHotelSturcture');

    const existingHotel = await collection.findOne({ id: 'structure' });

    if (existingHotel) {
      await collection.updateOne({ id: 'structure' }, { $set: inserthotelInfo });
    } else {
      // Insert new hotel information
      await collection.insertOne(inserthotelInfo);
    }

    const halalHotelsData = await collection.find().toArray();
    return {
      success: true,
      message: 'Halal rating structure information saved/updated successfully',
      data: halalHotelsData,
    };
  } catch (err) {
    return {
      success: false,
      error: 'Failed to save/update structure information',
    };
  }
};
const getAllHalalHotelInfo = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DbName);
    const collection = db.collection('halalHotels');
    const halalHotelsData = await collection.find().toArray();
    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 20;
    const totalHotels = halalHotelsData.length;

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
    const paginatedData = halalHotelsData.slice(offset, offset + limit);
    return {
      success: true,
      message: 'Get Hotel information  successfully',
      data: paginatedData,
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to get hotel information',
    };
  }
}
const getHalalHotelInfo = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DbName);
    const collection = db.collection('halalHotels');
    console.log(req.id);
    const halalHotel = await collection.findOne({ id: req.id });

    if (halalHotel) {
      return {
        success: true,
        message: 'Hotel information retrieved successfully',
        data: halalHotel,
      };
    } else {
      return {
        success: false,
        message: 'No halal hotel found with the specified ID',
        error: 'Hotel not found',
      };
    }
  } catch (error) {
    console.error('Failed to get hotel information:', error);
    return {
      success: false,
      message: 'Failed to retrieve hotel information',
      error: 'Internal server error',
    };
  }
};

const getHalalRatingStrucuture = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DbName);
    const collection = db.collection('halalHotelSturcture');
    console.log(req.id);
    const halalHotel = await collection.findOne({ id: 'structure' });

    if (halalHotel) {
      return {
        success: true,
        message: 'Halal rating structure  retrieved successfully',
        data: halalHotel,
      };
    } else {
      return {
        success: false,
        message: 'No Halal rating structurel found',
        error: 'Halal rating structure not found',
      };
    }
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
  saveOrUpdateHotelInfo,
  getHalalHotelInfo,
  getAllHalalHotelInfo,
  saveOrUpdateStructure,
  getHalalRatingStrucuture
};
