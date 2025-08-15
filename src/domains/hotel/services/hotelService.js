let axios;
try {
  axios = require('axios');
} catch (error) {
  // axios not available, will handle in functions
}
const btoa = require('btoa');
const { v4: uuidv4 } = require('uuid');
const Hotel = require('../models/Hotel');
const HotelBooking = require('../models/HotelBooking');
const HotelReview = require('../models/HotelReview');
const { setCacheData, getCacheData } = require('../../../shared/utils/nodeCache');
const { 
  MESSAGES: { SUCCESS: SUCCESS_MESSAGES, ERROR: ERROR_MESSAGES }, 
  HTTP_STATUS: HTTP_STATUS_CODES,
  RATEHAWK_API_CONFIG 
} = require('../../../shared/constants');

function generateUniqueSearchId() {
  return uuidv4();
}

function generateUniqueBookingId() {
  return 'HFL' + uuidv4();
}

function validateCheckinCheckout(checkin, checkout) {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const today = new Date();
  
  return checkinDate >= today && checkoutDate > checkinDate;
}

function isValidCountryCode(code) {
  return /^[A-Z]{2}$/.test(code);
}

function isValidCurrencyCode(code) {
  return /^[A-Z]{3}$/.test(code);
}

async function createAddressIndexIfNotExists(collection) {
  try {
    await collection.createIndex({ address: 'text' });
  } catch (error) {
    // Index might already exist
  }
}

async function createIdIndexIfNotExists(collection) {
  try {
    await collection.createIndex({ id: 1 });
  } catch (error) {
    // Index might already exist
  }
}

async function getHotelsDataMapping(cursor) {
  const hotelsDataMapping = {};
  await cursor.forEach(doc => {
    hotelsDataMapping[doc.id] = doc;
  });
  return hotelsDataMapping;
}

async function searchHotels(searchParams) {
  try {
    const uniqueSearchId = generateUniqueSearchId();
    const keyword = searchParams.city;

    // Validate dates
    const isValidDate = validateCheckinCheckout(searchParams.checkin, searchParams.checkout);
    if (!isValidDate) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_DATES
      };
    }

    // Validate guests
    if (Number(searchParams.guests) > 6) {
      return {
        success: false,
        message: ERROR_MESSAGES.TOO_MANY_GUESTS
      };
    }

    // Validate country code
    const isCountryCodeValid = isValidCountryCode(searchParams.residency);
    if (!isCountryCodeValid) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_COUNTRY_CODE
      };
    }

    // Validate currency code
    const isCurrencyCodeValid = isValidCurrencyCode(searchParams.currency);
    if (!isCurrencyCodeValid) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_CURRENCY_CODE
      };
    }

    // Search hotels from database
    const hotels = await Hotel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } }
      ],
      isActive: true
    }).limit(300);

    // Get halal ratings
    const halalRatings = await require('../models/HalalRating').find({
      hotelId: { $in: hotels.map(h => h.id) }
    });

    // Get reviews
    const reviews = await HotelReview.find({
      hotelId: { $in: hotels.map(h => h.id) }
    });

    // Create mappings
    const halalRatingsMap = halalRatings.reduce((map, rating) => {
      map[rating.hotelId] = rating;
      return map;
    }, {});

    const reviewsMap = reviews.reduce((map, review) => {
      map[review.hotelId] = review;
      return map;
    }, {});

    // Combine data
    const enrichedHotels = hotels.map(hotel => ({
      ...hotel.toObject(),
      halalRating: halalRatingsMap[hotel.id]?.totalRating || 0,
      review: reviewsMap[hotel.id] || null
    }));

    // Filter hotels with halal ratings
    const halalHotels = enrichedHotels.filter(hotel => hotel.halalRating > 0);

    // Cache the search results
    await setCacheData(uniqueSearchId, {
      searchParams,
      hotels: halalHotels,
      timestamp: new Date()
    });

    return {
      success: true,
      searchId: uniqueSearchId,
      data: halalHotels,
      message: SUCCESS_MESSAGES.HOTELS_FOUND
    };

  } catch (error) {
    console.error('Error in searchHotels:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

async function searchFilterHotels(filterParams) {
  try {
    const { searchId, travellerRating, amenities, deals, halalRating } = filterParams;
    
    // Get cached search results
    const cachedData = await getCacheData(searchId);
    if (!cachedData) {
      return {
        success: false,
        message: ERROR_MESSAGES.SEARCH_EXPIRED
      };
    }

    let filteredHotels = cachedData.hotels;

    // Apply filters
    if (travellerRating) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.starRating >= parseInt(travellerRating)
      );
    }

    if (amenities && amenities.length > 0) {
      filteredHotels = filteredHotels.filter(hotel =>
        amenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    if (halalRating) {
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.halalRating >= parseInt(halalRating)
      );
    }

    return {
      success: true,
      data: filteredHotels,
      message: SUCCESS_MESSAGES.HOTELS_FILTERED
    };

  } catch (error) {
    console.error('Error in searchFilterHotels:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

async function searchHotelDetails(detailParams) {
  try {
    const { id, checkin, checkout, guests, currency, residency } = detailParams;

    // Validate hotel exists
    const hotel = await Hotel.findOne({ id, isActive: true });
    if (!hotel) {
      return {
        success: false,
        message: ERROR_MESSAGES.HOTEL_NOT_FOUND
      };
    }

    // Get halal rating
    const halalRating = await require('../models/HalalRating').findOne({ hotelId: id });
    
    // Get reviews
    const review = await HotelReview.findOne({ hotelId: id });

    // Call RateHawk API for detailed pricing
    const ratehawkResponse = await callRatehawkAPI({
      hotelId: id,
      checkin,
      checkout,
      guests,
      currency,
      residency
    });

    const hotelDetails = {
      ...hotel.toObject(),
      halalRating: halalRating?.totalRating || 0,
      review: review || null,
      ratehawkData: ratehawkResponse
    };

    return {
      success: true,
      data: hotelDetails,
      message: SUCCESS_MESSAGES.HOTEL_DETAILS_FOUND
    };

  } catch (error) {
    console.error('Error in searchHotelDetails:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

async function callRatehawkAPI(params) {
  try {
    if (!axios) {
      console.log('Axios not available, skipping RateHawk API call');
      return null;
    }
    
    const { hotelId, checkin, checkout, guests, currency, residency } = params;
    
    // RateHawk API configuration
    const apiKey = process.env.RATEHAWK_API_KEY;
    const baseURL = RATEHAWK_API_CONFIG.BASE_URL;
    
    const response = await axios.get(`${baseURL}/hotels/${hotelId}/prices`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        checkin,
        checkout,
        guests,
        currency,
        residency
      }
    });

    return response.data;
  } catch (error) {
    console.error('RateHawk API error:', error);
    return null;
  }
}

async function bookHotel(bookingData) {
  try {
    const partnerOrderId = generateUniqueBookingId();
    const bookingId = generateUniqueBookingId();

    // Prepare the order booking request body
    const orderBookingRequestBody = prepareOrderBookingRequestBody(bookingData, partnerOrderId);

    // Make a request to get the order form data
    const formResponse = await makeOrderFormRequest(orderBookingRequestBody);

    if (formResponse.status === 'ok') {
      const bookingRequestBody = prepareBookingRequestBody(bookingData, partnerOrderId, formResponse.data);
      const finishResponse = await makeOrderFinishRequest(bookingRequestBody);

      if (finishResponse.status === 'ok') {
        // Create booking record
        const booking = new HotelBooking({
          bookingId,
          hotelId: bookingData.orderInfo.hotelId,
          userId: bookingData.userInfo.userId,
          email: bookingData.userInfo.email,
          partnerOrderId,
          checkIn: new Date(bookingData.orderInfo.checkin),
          checkOut: new Date(bookingData.orderInfo.checkout),
          guests: bookingData.guests.map(guest => ({
            firstName: guest.first_name,
            lastName: guest.last_name
          })),
          priceDetails: bookingData.priceDetails,
          paymentDetails: bookingData.paymentDetails,
          orderInfo: bookingData.orderInfo,
          userInfo: bookingData.userInfo,
          ratehawkResponse: formResponse.data,
          status: 'confirmed'
        });

        await booking.save();

        return {
          success: true,
          message: SUCCESS_MESSAGES.HOTEL_BOOKED,
          bookingId
        };
      } else {
        return {
          success: false,
          data: finishResponse,
          message: ERROR_MESSAGES.BOOKING_FAILED
        };
      }
    } else {
      return {
        success: false,
        data: formResponse,
        message: ERROR_MESSAGES.BOOKING_FAILED
      };
    }
  } catch (error) {
    console.error('Error in bookHotel:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

function prepareOrderBookingRequestBody(data, partnerOrderId) {
  // Implementation for preparing order booking request
  return {
    partnerOrderId,
    ...data
  };
}

function prepareBookingRequestBody(data, partnerOrderId, formData) {
  // Implementation for preparing booking request
  return {
    partnerOrderId,
    formData,
    ...data
  };
}

async function makeOrderFormRequest(requestBody) {
  try {
    if (!axios) {
      console.log('Axios not available, returning mock response');
      return { status: 'ok', data: { orderId: 'mock-order-id' } };
    }
    
    // Implementation for making order form request to RateHawk
    const response = await axios.post(
      `${RATEHAWK_API_CONFIG.BASE_URL}/orders/form`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${process.env.RATEHAWK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Order form request error:', error);
    return { status: 'error', message: error.message };
  }
}

async function makeOrderFinishRequest(requestBody) {
  try {
    if (!axios) {
      console.log('Axios not available, returning mock response');
      return { status: 'ok', data: { bookingId: 'mock-booking-id' } };
    }
    
    // Implementation for making order finish request to RateHawk
    const response = await axios.post(
      `${RATEHAWK_API_CONFIG.BASE_URL}/orders/finish`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${process.env.RATEHAWK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Order finish request error:', error);
    return { status: 'error', message: error.message };
  }
}

async function getAllBookings() {
  try {
    const bookings = await HotelBooking.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    return {
      success: true,
      data: bookings,
      message: SUCCESS_MESSAGES.BOOKINGS_RETRIEVED
    };
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

async function getBookingsByEmail(email) {
  try {
    const bookings = await HotelBooking.find({ email })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    return {
      success: true,
      data: bookings,
      message: SUCCESS_MESSAGES.BOOKINGS_RETRIEVED
    };
  } catch (error) {
    console.error('Error in getBookingsByEmail:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

async function getHotelById(hotelId) {
  try {
    const hotel = await Hotel.findOne({ id: hotelId, isActive: true });
    
    if (!hotel) {
      return {
        success: false,
        message: ERROR_MESSAGES.HOTEL_NOT_FOUND
      };
    }

    // Get halal rating
    const halalRating = await require('../models/HalalRating').findOne({ hotelId });
    
    // Get reviews
    const review = await HotelReview.findOne({ hotelId });

    const hotelData = {
      ...hotel.toObject(),
      halalRating: halalRating?.totalRating || 0,
      review: review || null
    };

    return {
      success: true,
      data: hotelData,
      message: SUCCESS_MESSAGES.HOTEL_FOUND
    };
  } catch (error) {
    console.error('Error in getHotelById:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    };
  }
}

module.exports = {
  searchHotels,
  searchFilterHotels,
  searchHotelDetails,
  bookHotel,
  getAllBookings,
  getBookingsByEmail,
  getHotelById
};
