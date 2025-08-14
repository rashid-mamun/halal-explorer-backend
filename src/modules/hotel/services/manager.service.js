const DumbHotel = require('../models/dumbHotel.model');
const HalalHotel = require('../models/halalHotel.model');
const Manager = require('../models/manager.model');
const AppError = require('../../../utils/appError');
const { validateManagerInfo, validateSearchHalalManagerHotels } = require('../validators/hotel.validator');

const transformImageUrls = (images, size) => images.map((url) => url.replace('{size}', size));

const mapHotelData = (doc) => ({
    hotelName: doc.name,
    address: doc.address,
    id: doc.id,
    latitude: doc.latitude,
    longitude: doc.longitude,
    region: doc.region,
    images: transformImageUrls(doc.images || [], '1024x768'),
});

const saveOrUpdateManagerInfo = async (managerInfo) => {
    validateManagerInfo(managerInfo);
    const updatedManager = await Manager.findOneAndUpdate(
        { id: managerInfo.id },
        { $set: managerInfo },
        { upsert: true, new: true }
    );
    return { success: true, message: 'Manager information saved/updated successfully', data: updatedManager };
};

const getAllManagerInfo = async (query) => {
    const { page = 1, pageSize = 100 } = query;
    const managers = await Manager.find().lean();
    const totalManagers = managers.length;
    if (totalManagers === 0) {
        throw new AppError('No managers found', 404);
    }

    const maxPageNumber = Math.ceil(totalManagers / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = managers.slice(offset, offset + pageSize);
    return { success: true, message: 'Managers fetched successfully', data: paginatedData, totalManagers };
};

const getManagerInfo = async (query) => {
    const manager = await Manager.findOne({ id: query.id }).lean();
    if (!manager) {
        throw new AppError('Manager not found', 404);
    }
    return { success: true, message: 'Manager fetched successfully', data: manager };
};

const searchHalalManagerHotels = async (query) => {
    validateSearchHalalManagerHotels(query);
    const { city, hotelName, page = 1, pageSize = 100 } = query;
    const keyword = city || hotelName;
    const field = city ? 'address' : 'name';

    const halalHotels = await HalalHotel.find().lean();
    const halalHotelsDataObj = halalHotels.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});

    const hotels = await DumbHotel.find(
        { [field]: { $regex: keyword, $options: 'i' } },
        { name: 1, address: 1, id: 1, latitude: 1, longitude: 1, region: 1, images: 1 }
    ).lean();

    const filteredHotels = hotels.filter((hotel) => halalHotelsDataObj[hotel.id]).map((hotel) => ({
        ...mapHotelData(hotel),
        halalRatingInfo: halalHotelsDataObj[hotel.id],
    }));

    const totalHotels = filteredHotels.length;
    if (totalHotels === 0) {
        throw new AppError('No halal hotels found', 404);
    }

    const maxPageNumber = Math.ceil(totalHotels / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = filteredHotels.slice(offset, offset + pageSize);
    return { success: true, totalHotels, data: paginatedData };
};

module.exports = {
    saveOrUpdateManagerInfo,
    getAllManagerInfo,
    getManagerInfo,
    searchHalalManagerHotels,
};