const hotelService = require('../services/hotelService');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendValidationErrorResponse 
} = require('../../../shared/utils/responseHandler');

async function hotelSearch(req, res) {
  try {
    const queryParams = req.query;
    const result = await hotelService.searchHotels(queryParams);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in hotelSearch:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function hotelBook(req, res) {
  try {
    const result = await hotelService.bookHotel(req.body);
    
    if (result.success) {
      return sendSuccessResponse(res, { bookingId: result.bookingId }, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in hotelBook:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getAllBookings(req, res) {
  try {
    const result = await hotelService.getAllBookings();
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getBookingsByEmail(req, res) {
  try {
    const { email } = req.params;
    const result = await hotelService.getBookingsByEmail(email);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in getBookingsByEmail:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function hotelSearchFilter(req, res) {
  try {
    const queryParams = req.query;
    const result = await hotelService.searchFilterHotels(queryParams);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in hotelSearchFilter:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function hotelSearchDetails(req, res) {
  try {
    const queryParams = req.query;
    const result = await hotelService.searchHotelDetails(queryParams);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in hotelSearchDetails:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getHotelById(req, res) {
  try {
    const { id } = req.query;
    const result = await hotelService.getHotelById(id);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 404);
    }
  } catch (error) {
    console.error('Error in getHotelById:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

module.exports = {
  hotelSearch,
  hotelBook,
  getAllBookings,
  getBookingsByEmail,
  hotelSearchFilter,
  hotelSearchDetails,
  getHotelById
};
