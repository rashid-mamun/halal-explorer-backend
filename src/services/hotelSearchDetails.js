const { getClient } = require("../config/database");
const axios = require('axios');
const btoa = require('btoa');


const searchHotelDetails= async (req) => {
    try {
        const isValidDate = validateCheckinCheckout(req.checkin, req.checkout);
        if (!isValidDate) {
            return {
                success: false,
                message: 'Invalid Format checkin and checkout dates. Please make sure the checkout date is after the checkin date.'
            }
        }

        if (Number(req.guests) > 6) {
            return {
                success: false,
                message: 'Please reduce the number of guests'
            }
        }
        const isCountryCodeValid = isValidCountryCode(req.residency);

        if (!isCountryCodeValid) {
            console.log('Invalid residency country code. Please provide a valid two-letter country code.!');
            return {
                success: false,
                message: 'Invalid residency country code. Please provide a valid two-letter country code.!'
            }
        }

        const isCurrencyCodeValid = isValidCurrencyCode(req.currency);
        if (!isCurrencyCodeValid) {
            const errorMessage = "Invalid currency code. Please provide a valid three-letter currency code.!";
            console.log(errorMessage);
            return {
                success: false,
                message: errorMessage
            }
        }
        const requestBody = prepareRequestBody(req, req.id);


        const response = await makeHotelSearchDetailsRequest(requestBody);
        console.log(JSON.stringify(response.data.data));
        if (response.data.status === "error") {
            return {
                success: false,
                message: 'no hotel found!'
            }
        }
        if (!response.data.data.hotels.length) {
            return {
                success: false,
                message: 'no hotel found! please change the search parameters'
            }
        }

        return {
            success: true,
            data: response.data.data.hotels,
        }

    } catch (err) {
        // console.error(err);
        // throw err;
        return {
            success: false,
            error: 'Internal server error'
        }
    }
};

const createAddressIndexIfNotExists = async (collection) => {
    const indexExists = await collection.indexExists('address_text');
    if (!indexExists) {
        await collection.createIndex({ address: "text" });
    }
};
const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const validateCheckinCheckout = (checkin, checkout) => {
    if (!isValidDate(checkin) || !isValidDate(checkout)) {
        return false;
    }
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (checkinDate >= checkoutDate) {
        return false;
    }
    return true;
};
const isValidCountryCode = (countryCode) => {
    const countryCodeRegex = /^[A-Za-z]{2}$/;
    return countryCodeRegex.test(countryCode);
};

const isValidCurrencyCode = (currencyCode) => {
    const currencyCodeRegex = /^[A-Za-z]{3}$/;
    return currencyCodeRegex.test(currencyCode);
};

const prepareRequestBody = (req, id) => ({
    checkin: req.checkin,
    checkout: req.checkout,
    residency: req.residency,
    language: "en",
    guests: [
        {
            adults: Number(req.guests),
            children: []
        }
    ],
    id,
    currency: req.currency
});

const getHotelsDataMapping = async (cursor) => {
    const hotelsDataMapping = {};

    await cursor.forEach((doc) => {
        const hotelData = mapHotelData(doc);
        if (hotelData.images.length > 0 ) {
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
    images: transformImageUrls(doc.images, '1024x768'),
    amenities:getGeneralAmenities(doc),
    mealIncluded:hasMealAmenities(doc),
    rating: doc.star_rating,
});

const transformImageUrls = (images, size) => {
    return images.map((imageUrl) => {
        const transformedUrl = imageUrl.replace('{size}', size);
        return transformedUrl;
    });
}
const getGeneralAmenities = (hotelData) => {
    const generalGroup = hotelData.amenity_groups.find(
      (group) => group.group_name === "General"
    );
  
    if (generalGroup) {
      return generalGroup.amenities;
    }
  
    return [];
  };
const hasMealAmenities = (hotelData) => {
    return hotelData.amenity_groups.some(
      (group) => group.group_name === "Meals"
    );
  };
const makeHotelSearchDetailsRequest = async (data) => {

    const authHeader = `Basic ${btoa(`4679:${process.env.password}`)}`;
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/search/hp/';
    // console.log(JSON.stringify(data));
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
        });
        // console.log(response);
        return response;
    } catch (error) {
        // console.error(error);
        return {
            success: false,
            error: 'Internal server error'
        }
    }
};

const mapUpdatedHotelsDataMapping = (hotelsInfo, hotelsDataMapping) => {

    return hotelsInfo.reduce((updatedHotelsDataMapping, hotelInfo) => {

        const hotelId = hotelInfo.id;
        if (hotelsDataMapping.hasOwnProperty(hotelId)) {
            let mealIncluded = false;
            let freeCancellation = false;
            let price = 0;

            hotelInfo.rates[0].daily_prices.forEach(p => {
                price += Number(p);
            });

            if (!hotelInfo.rates[0].no_show) {
                freeCancellation = true;
            }

            if (hotelInfo.rates[0].meal) {
                mealIncluded = true;
            }
            // console.log(JSON.stringify( hotelsDataMapping[hotelId].images));
            updatedHotelsDataMapping[hotelId] = {
                hotelName: hotelsDataMapping[hotelId].hotelName,
                address: hotelsDataMapping[hotelId].address,
                id: hotelsDataMapping[hotelId].id,
                latitude: hotelsDataMapping[hotelId].latitude,
                longitude: hotelsDataMapping[hotelId].longitude,
                region: hotelsDataMapping[hotelId].region,
                images: hotelsDataMapping[hotelId].images,
                amenities: hotelInfo.rates[0].amenities_data,
                mealIncluded: mealIncluded,
                freeCancellation: freeCancellation,
                price: parseFloat(price),
                currency: 'BDT',
                rating: hotelsDataMapping[hotelId].rating,
            };
        }

        return updatedHotelsDataMapping;
    }, {});
};

module.exports = {
    searchHotelDetails
};
