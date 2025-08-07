const mongoose = require('mongoose');
const CruisePackage = require('../models/cruisePackage');
const CruiseLine = require('../models/cruiseLine');
const Ship = require('../models/ship');

const createOrUpdateCruisePackage = async (packageData, files) => {
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

        const { cruiseLineId, shipId } = packageInfo;
        if (!mongoose.isValidObjectId(cruiseLineId) || !mongoose.isValidObjectId(shipId)) {
            throw new Error('Invalid cruise line or ship ID');
        }

        const cruiseLine = await CruiseLine.findById(cruiseLineId).session(session);
        const ship = await Ship.findById(shipId).session(session);
        if (!cruiseLine || !ship) {
            throw new Error('Cruise line or ship not found');
        }

        const existingPackage = await CruisePackage.findOne({
            packageName: packageInfo.packageName,
            cruiseLineId: packageInfo.cruiseLineId,
            shipId: packageInfo.shipId,
        }).session(session);

        if (existingPackage) {
            const updatedPackage = await CruisePackage.findByIdAndUpdate(
                existingPackage._id,
                { $set: packageInfo },
                { new: true, session }
            );
            await session.commitTransaction();
            return { success: true, data: updatedPackage, message: 'Cruise package updated successfully' };
        }

        const cruisePackage = new CruisePackage(packageInfo);
        await cruisePackage.save({ session });
        await session.commitTransaction();
        return { success: true, data: cruisePackage, message: 'Cruise package created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAllCruisePackages = async () => {
    try {
        const cruisePackages = await CruisePackage.find({}).populate('cruiseLineId shipId');
        return { success: true, data: cruisePackages };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const deleteCruisePackage = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!mongoose.isValidObjectId(id)) {
            throw new Error('Invalid cruise package ID');
        }
        const result = await CruisePackage.findByIdAndDelete(id, { session });
        if (!result) {
            throw new Error('Cruise package not found');
        }
        await session.commitTransaction();
        return { success: true, message: 'Cruise package deleted successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const searchCruisePackageById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid cruise package ID' };
        }
        const cruisePackage = await CruisePackage.findById(id).populate('cruiseLineId shipId');
        if (!cruisePackage) {
            return { success: false, error: 'Cruise package not found' };
        }
        return { success: true, data: cruisePackage };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createCruiseLine = async (cruiseLineData, files) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { logo } = files;
        const cruiseLineInfo = { ...cruiseLineData };

        if (logo && logo.length > 0) {
            cruiseLineInfo.logo = logo[0].path;
        }

        const existingCruiseLine = await CruiseLine.findOne({ name: cruiseLineInfo.name }).session(session);
        if (existingCruiseLine) {
            throw new Error('Cruise line already exists');
        }

        const cruiseLine = new CruiseLine(cruiseLineInfo);
        await cruiseLine.save({ session });
        await session.commitTransaction();
        return { success: true, data: cruiseLine, message: 'Cruise line created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const createShip = async (shipData, files) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { image } = files;
        const shipInfo = { ...shipData };

        if (image && image.length > 0) {
            shipInfo.image = image[0].path;
        }

        if (!mongoose.isValidObjectId(shipInfo.cruiseLineId)) {
            throw new Error('Invalid cruise line ID');
        }

        const cruiseLine = await CruiseLine.findById(shipInfo.cruiseLineId).session(session);
        if (!cruiseLine) {
            throw new Error('Cruise line not found');
        }

        const existingShip = await Ship.findOne({
            name: shipInfo.name,
            cruiseLineId: shipInfo.cruiseLineId,
        }).session(session);
        if (existingShip) {
            throw new Error('Ship already exists for this cruise line');
        }

        const ship = new Ship(shipInfo);
        await ship.save({ session });
        await session.commitTransaction();
        return { success: true, data: ship, message: 'Ship created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

module.exports = {
    createOrUpdateCruisePackage,
    getAllCruisePackages,
    deleteCruisePackage,
    searchCruisePackageById,
    createCruiseLine,
    createShip,
};