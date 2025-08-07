const mongoose = require('mongoose');
const HolidayPackage = require('../models/holidayPackage');

const createOrUpdateHolidayPackage = async (packageData, files) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { coverImage, gallery } = files;
        const packageInfo = { ...packageData };

        if (coverImage && coverImage.length > 0) {
            packageInfo.coverImage = coverImage[0].path;
        }
        if (gallery && gallery.length > 0) {
            packageInfo.gallery = gallery.map(file => file.path);
        }

        const existingPackage = await HolidayPackage.findOne({
            packageName: packageInfo.packageName,
            address: packageInfo.address,
            duration: packageInfo.duration,
        }).session(session);

        if (existingPackage) {
            const updatedPackage = await HolidayPackage.findByIdAndUpdate(
                existingPackage._id,
                { $set: packageInfo },
                { new: true, session }
            );
            await session.commitTransaction();
            return { success: true, data: updatedPackage, message: 'Holiday package updated successfully' };
        }

        const holidayPackage = new HolidayPackage(packageInfo);
        await holidayPackage.save({ session });
        await session.commitTransaction();
        return { success: true, data: holidayPackage, message: 'Holiday package created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAllHolidayPackages = async () => {
    try {
        const holidayPackages = await HolidayPackage.find({});
        return { success: true, data: holidayPackages };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const deleteHolidayPackage = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!mongoose.isValidObjectId(id)) {
            throw new Error('Invalid holiday package ID');
        }
        const result = await HolidayPackage.findByIdAndDelete(id, { session });
        if (!result) {
            throw new Error('Holiday package not found');
        }
        await session.commitTransaction();
        return { success: true, message: 'Holiday package deleted successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const searchHolidayPackageById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid holiday package ID' };
        }
        const holidayPackage = await HolidayPackage.findById(id);
        if (!holidayPackage) {
            return { success: false, error: 'Holiday package not found' };
        }
        return { success: true, data: holidayPackage };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = {
    createOrUpdateHolidayPackage,
    getAllHolidayPackages,
    deleteHolidayPackage,
    searchHolidayPackageById,
};