const { getClient } = require("../config/database");
const axios = require('axios');
const btoa = require('btoa');

async function searchHotels(req) {
    try {
        const client = getClient();
        const db = client.db(process.env.DbName);
        const collection = db.collection(process.env.collectionName);

        const keyword = req.city;

        // Create the text index if not already created
        const indexExists = await collection.indexExists('address_text');
        if (!indexExists) {
            await collection.createIndex({ address: "text" });
        }

        // Perform the text search query and retrieve only the id field
        const query = { $text: { $search: keyword } };
        const projection = { id: 1 };
        const cursor = collection.find(query, projection).limit(300);


        // Extract the id field from each document
        const hotelsDataMapping = {};
        await cursor.forEach(doc => {
            hotelsDataMapping[doc.id] = {
                hotelName: doc.name,
                address: doc.address,
                id: doc.id,
                latitude: doc.latitude,
                longitude: doc.longitude,
                region: doc.region,
                images: transformImageUrls(doc.images, '1024x768'),
                rating: doc.star_rating,


            };
        });
        const ids = Object.keys(hotelsDataMapping);
        // console.log(JSON.stringify(ids));


        const requestBody = {
            checkin: req.checkin,
            checkout: req.checkout,
            residency: "bd",
            language: "en",
            guests: [
                {
                    "adults": Number(req.guests),
                    "children": []
                }
            ],
            ids: ids,
            // ids: ["test_hotel_do_not_book"],
            currency: "BDT"
        }

        // Make the API request
        const response = await makeHotelSearchRequest(requestBody, req);

        if (response.data.status === "error") {
            return "no hotel found!"
        }

        console.log("================data==========\n", JSON.stringify(response.data));

        const hotelsInfo = response.data.data.hotels;
        console.log(hotelsInfo);

        const updatedHotelsDataMapping = {};
        hotelsInfo.forEach(hotelInfo => {
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
        });
        console.log(JSON.stringify(updatedHotelsDataMapping));
        const finalOutPut = Object.values(updatedHotelsDataMapping)

        return finalOutPut;
    } catch (err) {
        console.error(err);
        return err;
    }
}
function transformImageUrls(images, size) {
    return images.map((imageUrl) => {
        const transformedUrl = imageUrl.replace('{size}', size);
        return transformedUrl;
    });
}

async function makeHotelSearchRequest(data, req) {
    const username = process.env.username;
    const password = process.env.password;
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    const apiUrl = 'https://api.worldota.net/api/b2b/v3/search/serp/hotels/';

    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            // params: req.query // Include query parameters from the original request
        });

        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = {
    searchHotels
};