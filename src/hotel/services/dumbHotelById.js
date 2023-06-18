const { getClient } = require("../../config/database");
const axios = require('axios');
const btoa = require('btoa');


const dumbHotelById = async (req) => {
    try {

        const keyword = req.id;
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const dumbHotelcollection = db.collection(process.env.DUMB_HOTEL_COLLECTION);
        const halalHotelCollection = db.collection(process.env.HALAL_HOTELS_COLLECTION);
        const managerInfoCollection = db.collection(process.env.MANAGER_INFO_COLLECTION);

        await createIdIndexIfNotExists(dumbHotelcollection);
        await createIdIndexIfNotExists(halalHotelCollection);
        await createIdIndexIfNotExists(managerInfoCollection);

        const query = { id: keyword };
        let dumbsHotelData = await dumbHotelcollection.findOne(query);
        console.log(dumbsHotelData);
        if (!dumbsHotelData) {
            return {
                success: false,
                error: 'No hotel found!'
            }
        }
        dumbsHotelData = prepareDumbHotelData(dumbsHotelData);

        let halalHotelData = await halalHotelCollection.findOne(query);
        console.log('\n------------halalHotelData------------\n', JSON.stringify(halalHotelData, null, 2));
        let managerInfoCollectionData = await managerInfoCollection.find().toArray();
        const managerDataObj = managerInfoCollectionData.reduce((obj, manager) => {
            obj[manager.id] = {
                name: manager.managerName,
                email: manager.email,

            };
            return obj;
        }, {});
        // console.log(JSON.stringify(dumbsHotelData));



        return {
            success: true,
            dumpHotelInfo: dumbsHotelData,
            ...(managerDataObj[req.id] && { managerData: managerDataObj[req.id] }),
            ...(halalHotelData && { halalHotelInfo: halalHotelData }),
        }

    } catch (err) {
        console.error(err);
        // throw err;
        return {
            success: false,
            error: 'Internal server error'
        }
    }
};

const createIdIndexIfNotExists = async (collection) => {
    const indexExists = await collection.indexExists('id_index');
    if (!indexExists) {
        await collection.createIndex({ id: 1 }, { name: 'id_index' });
    }
};
const prepareDumbHotelData = (doc) => ({
    hotelName: doc.name,
    address: doc.address,
    id: doc.id,
    phone: doc.phone,
    postal_code: doc.postal_code,
    latitude: doc.latitude,
    longitude: doc.longitude,
    region: doc.region,
    description_struct: doc.description_struct,
    images: transformImageUrls(doc.images, '1024x768'),
    rating: doc.star_rating,
    email: doc.email,
    is_closed: doc.is_closed,
    metapolicy_extra_info: doc.metapolicy_extra_info,
    policy_struct: doc.policy_struct,
    facts: doc.facts,
    hotel_chain: doc.hotel_chain,
    front_desk_time_start: doc.front_desk_time_start,
    front_desk_time_end: doc.front_desk_time_end,
    is_gender_specification_required: doc.is_gender_specification_required,
})


const transformImageUrls = (images, size) => {
    return images.map((imageUrl) => {
        const transformedUrl = imageUrl.replace('{size}', size);
        return transformedUrl;
    });
}

module.exports = {
    dumbHotelById
};
