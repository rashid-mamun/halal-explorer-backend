const HalalRating = require('../models/HalalRating');
const HalalRatingStructure = require('../models/HalalRatingStructure');
const { 
  MESSAGES: { SUCCESS: SUCCESS_MESSAGES, ERROR: ERROR_MESSAGES }
} = require('../../../shared/constants');

async function saveOrUpdateHotelInfo(hotelInfo) {
  try {
    const totalRating = hotelInfo.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      return {
        success: false,
        error: ERROR_MESSAGES.RATING_EXCEEDS_LIMIT
      };
    }

    const halalRatingData = {
      hotelId: hotelInfo.id,
      ratings: hotelInfo.ratings,
      totalRating: totalRating
    };

    const existingRating = await HalalRating.findOne({ hotelId: hotelInfo.id });

    if (existingRating) {
      await HalalRating.updateOne(
        { hotelId: hotelInfo.id }, 
        { $set: halalRatingData }
      );
    } else {
      await HalalRating.create(halalRatingData);
    }

    const allRatings = await HalalRating.find().populate('hotelId', 'name city');
    
    return {
      success: true,
      message: SUCCESS_MESSAGES.HALAL_RATING_SAVED,
      data: allRatings
    };
  } catch (error) {
    console.error('Error in saveOrUpdateHotelInfo:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_SAVE_RATING
    };
  }
}

async function saveOrUpdateStructure(structureInfo) {
  try {
    const totalRating = structureInfo.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      return {
        success: false,
        error: ERROR_MESSAGES.RATING_EXCEEDS_LIMIT
      };
    }

    const structureData = {
      id: 'structure',
      ratings: structureInfo.ratings,
      totalRating: totalRating
    };

    const existingStructure = await HalalRatingStructure.findOne({ id: 'structure' });

    if (existingStructure) {
      await HalalRatingStructure.updateOne(
        { id: 'structure' }, 
        { $set: structureData }
      );
    } else {
      await HalalRatingStructure.create(structureData);
    }

    const allStructures = await HalalRatingStructure.find();
    
    return {
      success: true,
      message: SUCCESS_MESSAGES.STRUCTURE_SAVED,
      data: allStructures
    };
  } catch (error) {
    console.error('Error in saveOrUpdateStructure:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_SAVE_STRUCTURE
    };
  }
}

async function getAllHalalHotelInfo(queryParams) {
  try {
    const page = parseInt(queryParams.page) || 1;
    const pageSize = parseInt(queryParams.pageSize) || 100;
    
    const totalRatings = await HalalRating.countDocuments();
    const maxPageNumber = Math.ceil(totalRatings / pageSize);
    
    if (page > maxPageNumber && totalRatings > 0) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_PAGE_NUMBER
      };
    }

    const offset = (page - 1) * pageSize;
    
    const ratings = await HalalRating.find()
      .skip(offset)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: SUCCESS_MESSAGES.HALAL_RATINGS_RETRIEVED,
      data: {
        ratings,
        pagination: {
          currentPage: page,
          totalPages: maxPageNumber,
          totalItems: totalRatings,
          itemsPerPage: pageSize
        }
      }
    };
  } catch (error) {
    console.error('Error in getAllHalalHotelInfo:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_RETRIEVE_RATINGS
    };
  }
}

async function getHalalHotelInfo(hotelId) {
  try {
    const rating = await HalalRating.findOne({ hotelId });

    if (!rating) {
      return {
        success: false,
        message: ERROR_MESSAGES.HALAL_RATING_NOT_FOUND
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.HALAL_RATING_RETRIEVED,
      data: rating
    };
  } catch (error) {
    console.error('Error in getHalalHotelInfo:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_RETRIEVE_RATING
    };
  }
}

async function getHalalRatingStructure() {
  try {
    const structure = await HalalRatingStructure.findOne({ id: 'structure' });

    if (!structure) {
      return {
        success: false,
        message: ERROR_MESSAGES.STRUCTURE_NOT_FOUND
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.STRUCTURE_RETRIEVED,
      data: structure
    };
  } catch (error) {
    console.error('Error in getHalalRatingStructure:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_RETRIEVE_STRUCTURE
    };
  }
}

async function searchHalalHotels(searchParams) {
  try {
    const { city, hotelName } = searchParams;
    let query = {};

    if (city) {
      query['hotelId.city'] = { $regex: city, $options: 'i' };
    }

    if (hotelName) {
      query['hotelId.name'] = { $regex: hotelName, $options: 'i' };
    }

    const ratings = await HalalRating.find(query)
      .sort({ totalRating: -1 });

    return {
      success: true,
      data: ratings,
      message: SUCCESS_MESSAGES.HALAL_HOTELS_FOUND
    };
  } catch (error) {
    console.error('Error in searchHalalHotels:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

module.exports = {
  saveOrUpdateHotelInfo,
  saveOrUpdateStructure,
  getAllHalalHotelInfo,
  getHalalHotelInfo,
  getHalalRatingStructure,
  searchHalalHotels
};
