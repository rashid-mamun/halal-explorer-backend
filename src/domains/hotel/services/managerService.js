const HotelManager = require('../models/HotelManager');
const Hotel = require('../models/Hotel');
const HalalRating = require('../models/HalalRating');
const { 
  MESSAGES: { SUCCESS: SUCCESS_MESSAGES, ERROR: ERROR_MESSAGES }
} = require('../../../shared/constants');

async function saveOrUpdateManagerInfo(managerInfo) {
  try {
    const existingManager = await HotelManager.findOne({ id: managerInfo.id });

    if (existingManager) {
      await HotelManager.updateOne(
        { id: managerInfo.id }, 
        { $set: managerInfo }
      );
    } else {
      await HotelManager.create(managerInfo);
    }

    const allManagers = await HotelManager.find().sort({ createdAt: -1 });
    
    return {
      success: true,
      message: SUCCESS_MESSAGES.MANAGER_SAVED,
      data: allManagers
    };
  } catch (error) {
    console.error('Error in saveOrUpdateManagerInfo:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_SAVE_MANAGER
    };
  }
}

async function getAllManagerInfo(queryParams) {
  try {
    const page = parseInt(queryParams.page) || 1;
    const pageSize = parseInt(queryParams.pageSize) || 100;
    
    const totalManagers = await HotelManager.countDocuments();
    const maxPageNumber = Math.ceil(totalManagers / pageSize);
    
    if (page > maxPageNumber && totalManagers > 0) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_PAGE_NUMBER
      };
    }

    const offset = (page - 1) * pageSize;
    
    const managers = await HotelManager.find()
      .skip(offset)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: SUCCESS_MESSAGES.MANAGERS_RETRIEVED,
      data: {
        managers,
        pagination: {
          currentPage: page,
          totalPages: maxPageNumber,
          totalItems: totalManagers,
          itemsPerPage: pageSize
        }
      }
    };
  } catch (error) {
    console.error('Error in getAllManagerInfo:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_RETRIEVE_MANAGERS
    };
  }
}

async function getManagerInfo(queryParams) {
  try {
    const manager = await HotelManager.findOne({ id: queryParams.id });

    if (!manager) {
      return {
        success: false,
        message: ERROR_MESSAGES.MANAGER_NOT_FOUND
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.MANAGER_RETRIEVED,
      data: manager
    };
  } catch (error) {
    console.error('Error in getManagerInfo:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FAILED_TO_RETRIEVE_MANAGER
    };
  }
}

async function searchHalalManagerHotels(searchParams) {
  try {
    const { city, hotelName } = searchParams;
    let query = { isActive: true };

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (hotelName) {
      query.name = { $regex: hotelName, $options: 'i' };
    }

    // Get hotels with managers
    const hotelsWithManagers = await Hotel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'hotelmanagers',
          localField: 'id',
          foreignField: 'hotelId',
          as: 'manager'
        }
      },
      {
        $lookup: {
          from: 'halalratings',
          localField: 'id',
          foreignField: 'hotelId',
          as: 'halalRating'
        }
      },
      {
        $match: {
          'manager.0': { $exists: true }
        }
      },
      {
        $project: {
          id: 1,
          name: 1,
          city: 1,
          country: 1,
          address: 1,
          starRating: 1,
          amenities: 1,
          manager: { $arrayElemAt: ['$manager', 0] },
          halalRating: { $arrayElemAt: ['$halalRating.totalRating', 0] }
        }
      },
      {
        $sort: { 'halalRating': -1 }
      }
    ]);

    return {
      success: true,
      data: hotelsWithManagers,
      message: SUCCESS_MESSAGES.MANAGER_HOTELS_FOUND
    };
  } catch (error) {
    console.error('Error in searchHalalManagerHotels:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

module.exports = {
  saveOrUpdateManagerInfo,
  getAllManagerInfo,
  getManagerInfo,
  searchHalalManagerHotels
};
