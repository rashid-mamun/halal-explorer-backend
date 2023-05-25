const { getClient } = require("../config/database");
const axios = require('axios');
const btoa = require('btoa');


const searchHotels = async (req) => {
    try {

        const keyword = req.city;
        const client = getClient();
        const db = client.db(process.env.DbName);
        const collection = db.collection(process.env.collectionName);

        await createAddressIndexIfNotExists(collection);
        const query = { $text: { $search: keyword } };
        const projection = { id: 1 };
        const cursor = collection.find(query, projection).limit(300);

        const hotelsDataMapping = await getHotelsDataMapping(cursor);

        const ids = Object.keys(hotelsDataMapping);
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
        const requestBody = prepareRequestBody(req, ids);


        const response = await makeHotelSearchRequest(requestBody);
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

        const hotelsInfo = response.data.data.hotels;

        const updatedHotelsDataMapping = mapUpdatedHotelsDataMapping(hotelsInfo, hotelsDataMapping);

        // console.log(JSON.stringify(updatedHotelsDataMapping));

        const hotels = Object.values(updatedHotelsDataMapping);
        const filteredHotels = hotels.filter(item => item.region.country_code.toLowerCase() === req.residency.toLowerCase());
        if (!filteredHotels.length) {
            return {
                success: false,
                message: 'no hotel found! please change the search parameters'
            }
        }

        return {
            success: true,
            data: filteredHotels
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

const prepareRequestBody = (req, ids) => ({
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
    ids,
    currency: req.currency
});

const getHotelsDataMapping = async (cursor) => {
    const hotelsDataMapping = {};

    await cursor.forEach((doc) => {
        hotelsDataMapping[doc.id] = mapHotelData(doc);
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
    rating: doc.star_rating,
});

const transformImageUrls = (images, size) => {
    images.map((imageUrl) => {
        const transformedUrl = imageUrl.replace('{size}', size);
        return transformedUrl;
    });
}


const makeHotelSearchRequest = async (data) => {
    const authHeader = `Basic ${btoa(`${process.env.username}:${process.env.password}`)}`;
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/search/serp/hotels/';

    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
        });

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
    searchHotels
};
