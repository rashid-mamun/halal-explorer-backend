const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { setCacheData, getCacheData } = require('../../../utils/nodeCache');
const DumbHotel = require('../models/dumbHotel.model');
const HalalHotel = require('../models/halalHotel.model');
const Review = require('../models/review.model');
const AppError = require('../../../utils/appError');
const {
    validateHotelSearch,
    validateHotelSearchFilter,
    validateHotelSearchDetails,
    validateDumbHotelById,
} = require('../validators/hotel.validator');

const createAuthHeader = () => {
    const auth = Buffer.from(`${process.env.RATEHAWK_USERNAME}:${process.env.RATEHAWK_PASSWORD}`).toString('base64');
    return `Basic ${auth}`;
};

const makeHotelSearchRequest = async (data) => {
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/search/serp/hotels/';
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: createAuthHeader(),
            },
        });
        return response.data;
    } catch (error) {
        throw new AppError(error.response?.data?.error || 'Failed to fetch data from RateHawk API', error.response?.status || 500);
    }
};

const makeHotelSearchDetailsRequest = async (data) => {
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/search/hp/';
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: createAuthHeader(),
            },
        });
        return response.data;
    } catch (error) {
        throw new AppError(error.response?.data?.error || 'Failed to fetch hotel details from RateHawk API', error.response?.status || 500);
    }
};

const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const validateCheckinCheckout = (checkin, checkout) => {
    if (!isValidDate(checkin) || !isValidDate(checkout)) return false;
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    return checkinDate < checkoutDate;
};

const isValidCountryCode = (countryCode) => /^[A-Za-z]{2}$/.test(countryCode);

const isValidCurrencyCode = (currencyCode) => /^[A-Za-z]{3}$/.test(currencyCode);

const transformImageUrls = (images, size) => images.map((url) => url.replace('{size}', size));

const getGeneralAmenities = (hotelData) => {
    const generalGroup = hotelData.amenity_groups?.find((group) => group.group_name === 'General');
    return generalGroup ? generalGroup.amenities : [];
};

const hasMealAmenities = (hotelData) => hotelData.amenity_groups?.some((group) => group.group_name === 'Meals');

const mapHotelData = (doc) => ({
    hotelName: doc.name,
    address: doc.address,
    id: doc.id,
    latitude: doc.latitude,
    longitude: doc.longitude,
    region: doc.region,
    images: transformImageUrls(doc.images || [], '1024x768'),
    amenities: getGeneralAmenities(doc),
    mealIncluded: hasMealAmenities(doc),
    rating: doc.star_rating,
});

const mapUpdatedHotelsDataMapping = (hotelsInfo, hotelsDataMapping, reviewsDataObj, halalHotelsDataObj) => {
    return hotelsInfo.reduce((acc, hotelInfo) => {
        const hotelId = hotelInfo.id;
        if (hotelsDataMapping[hotelId]) {
            let mealIncluded = !!hotelInfo.rates[0]?.meal;
            let freeCancellation = !hotelInfo.rates[0]?.no_show;
            let price = hotelInfo.rates[0]?.daily_prices.reduce((sum, p) => sum + Number(p), 0) || 0;

            acc[hotelId] = {
                hotelName: hotelsDataMapping[hotelId].hotelName,
                address: hotelsDataMapping[hotelId].address,
                id: hotelId,
                latitude: hotelsDataMapping[hotelId].latitude,
                longitude: hotelsDataMapping[hotelId].longitude,
                region: hotelsDataMapping[hotelId].region,
                images: hotelsDataMapping[hotelId].images,
                amenities: hotelInfo.rates[0]?.amenities_data || [],
                mealIncluded,
                freeCancellation,
                price: parseFloat(price),
                currency: 'BDT',
                rating: hotelsDataMapping[hotelId].rating,
                ...(reviewsDataObj[hotelId] && { review: reviewsDataObj[hotelId] }),
                ...(halalHotelsDataObj[hotelId] && { halalRating: halalHotelsDataObj[hotelId].star_rating }),
            };
        }
        return acc;
    }, {});
};

const searchHotels = async (query) => {
    validateHotelSearch(query);
    const { city, checkin, checkout, guests, currency, residency, page = 1, pageSize = 100 } = query;

    if (!validateCheckinCheckout(checkin, checkout)) {
        throw new AppError('Invalid check-in or check-out date format or check-out is not after check-in', 400);
    }
    if (Number(guests) > 6) {
        throw new AppError('Number of guests cannot exceed 6', 400);
    }
    if (!isValidCountryCode(residency)) {
        throw new AppError('Invalid residency country code. Use a valid two-letter code.', 400);
    }
    if (!isValidCurrencyCode(currency)) {
        throw new AppError('Invalid currency code. Use a valid three-letter code.', 400);
    }

    const hotels = await DumbHotel.find({ $text: { $search: city } }, { id: 1 }).lean();
    const halalHotels = await HalalHotel.find().lean();
    const reviews = await Review.find().lean();

    const halalHotelsDataObj = halalHotels.reduce((acc, hotel) => {
        acc[hotel.id] = { id: hotel.id, star_rating: hotel.star_rating };
        return acc;
    }, {});
    const reviewsDataObj = reviews.reduce((acc, review) => {
        acc[review.id] = { id: review.id, rating: review.rating, detailed_ratings: review.detailed_ratings, reviews: review.reviews };
        return acc;
    }, {});

    const hotelsDataMapping = hotels.reduce((acc, doc) => {
        const hotelData = mapHotelData(doc);
        if (hotelData.images.length > 0) acc[doc.id] = hotelData;
        return acc;
    }, {});

    let dumsIds = Object.keys(hotelsDataMapping).filter((id) => halalHotelsDataObj[id]);
    const ids = dumsIds.length > 300 ? dumsIds.slice(0, 299) : dumsIds;

    const requestBody = {
        checkin,
        checkout,
        residency,
        language: 'en',
        guests: [{ adults: Number(guests), children: [] }],
        ids,
        currency,
    };

    const response = await makeHotelSearchRequest(requestBody);
    if (response.status === 'error' || !response.data?.hotels?.length) {
        throw new AppError('No hotels found. Please change search parameters.', 404);
    }

    const hotelsInfo = response.data.hotels;
    const updatedHotelsDataMapping = mapUpdatedHotelsDataMapping(hotelsInfo, hotelsDataMapping, reviewsDataObj, halalHotelsDataObj);

    const hotelsList = Object.values(updatedHotelsDataMapping);
    const totalHotels = hotelsList.length;
    if (totalHotels === 0) {
        throw new AppError('No hotels found.', 404);
    }

    const maxPageNumber = Math.ceil(totalHotels / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = hotelsList.slice(offset, offset + pageSize);
    const searchId = uuidv4();
    await setCacheData(searchId, paginatedData);

    return { success: true, totalHotels, searchId, data: paginatedData };
};

const searchHotelDetails = async (query) => {
    validateHotelSearchDetails(query);
    const { id, checkin, checkout, guests, currency, residency } = query;

    if (!validateCheckinCheckout(checkin, checkout)) {
        throw new AppError('Invalid check-in or check-out date format or check-out is not after check-in', 400);
    }
    if (Number(guests) > 6) {
        throw new AppError('Number of guests cannot exceed 6', 400);
    }
    if (!isValidCountryCode(residency)) {
        throw new AppError('Invalid residency country code. Use a valid two-letter code.', 400);
    }
    if (!isValidCurrencyCode(currency)) {
        throw new AppError('Invalid currency code. Use a valid three-letter code.', 400);
    }

    const dumbHotel = await DumbHotel.findOne({ id }).lean();
    if (!dumbHotel) {
        throw new AppError('Hotel not found', 404);
    }

    const halalHotel = await HalalHotel.findOne({ id }).lean();
    const review = await Review.findOne({ id }).lean();

    const requestBody = {
        checkin,
        checkout,
        residency,
        language: 'en',
        guests: [{ adults: Number(guests), children: [] }],
        id,
        currency,
    };

    const response = await makeHotelSearchDetailsRequest(requestBody);
    if (response.status === 'error' || !response.data?.hotels?.length) {
        throw new AppError('No hotel details found. Please change search parameters.', 404);
    }

    return {
        success: true,
        data: response.data.hotels,
        dumpHotelInfo: mapHotelData(dumbHotel),
        ...(review && { review }),
        ...(halalHotel && { halalHotelInfo: halalHotel }),
    };
};

const searchFilterHotels = async (query) => {
    validateHotelSearchFilter(query);
    const { searchId, travellerRating, amenities, deals, halalRating, page = 1, pageSize = 100 } = query;

    const cacheResult = await getCacheData(searchId);
    if (!cacheResult.success) {
        throw new AppError('Data not found in cache', 404);
    }

    const hotelCacheData = cacheResult.cache;
    const desiredMealIncluded = deals?.includes('mealIncluded') || false;
    const desiredFreeCancellation = deals?.includes('freeCancellation') || false;
    const minTravellerRating = parseInt(travellerRating) || null;
    const minHalalRating = parseInt(halalRating) || null;

    const filteredHotels = hotelCacheData.filter((hotel) => {
        const meetsAmenities = !amenities || amenities.some((amenity) => hotel.amenities.includes(amenity));
        const meetsMeal = !desiredMealIncluded || hotel.mealIncluded;
        const meetsFreeCancellation = !desiredFreeCancellation || hotel.freeCancellation;
        const meetsTravellerRating = minTravellerRating === null || hotel.rating >= minTravellerRating;
        const meetsHalalRating = minHalalRating === null || hotel.halalRating >= minHalalRating;
        return meetsAmenities && meetsMeal && meetsFreeCancellation && meetsTravellerRating && meetsHalalRating;
    });

    const totalHotels = filteredHotels.length;
    if (totalHotels === 0) {
        throw new AppError('No hotels match the filter criteria', 404);
    }

    const maxPageNumber = Math.ceil(totalHotels / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = filteredHotels.slice(offset, offset + pageSize);

    return { success: true, searchId, totalHotels, data: paginatedData };
};

const dumbHotelById = async (query) => {
    validateDumbHotelById(query);
    const { id } = query;

    const dumbHotel = await DumbHotel.findOne({ id }).lean();
    if (!dumbHotel) {
        throw new AppError('No hotel found', 404);
    }

    const halalHotel = await HalalHotel.findOne({ id }).lean();
    const manager = await Manager.findOne({ id }).lean();

    return {
        success: true,
        dumpHotelInfo: mapHotelData(dumbHotel),
        ...(manager && { managerData: { name: manager.managerName, email: manager.email } }),
        ...(halalHotel && { halalHotelInfo: halalHotel }),
    };
};

module.exports = {
    searchHotels,
    searchHotelDetails,
    searchFilterHotels,
    dumbHotelById,
};