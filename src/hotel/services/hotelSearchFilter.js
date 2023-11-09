const { getCacheData } = require('../../utils/nodeCache')


const searchFilterHotels = async (req) => {
    try {

        const searchId = req.searchId;
        const desiredAmenities = req.amenities;
        const desiredDeals = req.deals;
        const minTravellerRating = parseInt(req.travellerRating) || null;
        const minHalalRating = parseInt(req.halalRating) || null;

        let desiredMealIncluded;
        let desiredFreeCancellation;
        if (desiredDeals) {
            desiredMealIncluded = desiredDeals.includes('mealIncluded');
            desiredFreeCancellation = desiredDeals.includes('freeCancellation');

        } else {
            desiredMealIncluded = false;
            desiredFreeCancellation = false;

        }
        console.log(`desiredMealIncluded: ${desiredMealIncluded}`);
        console.log(`desiredFreeCancellation: ${desiredFreeCancellation}`);

        const hotelCacheDataRes = await getCacheData(searchId);
        if (!hotelCacheDataRes.success) {
            return {
                success: false,
                error: 'Data not found in cache'
            }
        }
        const hotelCacheData = hotelCacheDataRes.cache;

        const filteredHotels = hotelCacheData.filter(hotel => {

            const meetsAmenities = !desiredAmenities || desiredAmenities.some(amenity => hotel.amenities.includes(amenity));
            const meetsMeal = desiredMealIncluded === false || hotel.mealIncluded;
            const meetsFreeCancellation = desiredFreeCancellation === false || hotel.freeCancellation;
            const meetsTravellerRating = minTravellerRating === null || hotel.rating >= minTravellerRating;
            const meetsHalalRating = minHalalRating === null || hotel.halalRating >= minHalalRating;
            console.log(`meetsAmenities=${meetsAmenities}  meetsMeal=${meetsMeal} meetsFreeCancellation=${meetsFreeCancellation} meetsTravellerRating=${meetsTravellerRating}  meetsHalalRating=${meetsHalalRating}`);
            return meetsAmenities && meetsMeal && meetsFreeCancellation && meetsTravellerRating && meetsHalalRating;
        });

        const totalHotels = filteredHotels.length;
        if (totalHotels == 0) {
            return {
                success: false,
                message: 'Please change the filter parameter'
            }
        }
        const page = req.page;
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(req.pageSize, 10) || 100;
        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        const paginatedData = filteredHotels.slice(offset, offset + limit);

        return {
            success: true,
            searchId,
            totalHotels,
            data: paginatedData,
        }

    } catch (err) {
        console.error(err);
        return {
            success: false,
            error: 'Internal server error'
        }
    }
};






module.exports = {
    searchFilterHotels
};
