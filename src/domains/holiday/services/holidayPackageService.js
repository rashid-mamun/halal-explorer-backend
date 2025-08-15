const HolidayPackage = require('../models/HolidayPackage');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique booking code
 */
const generateBookingCode = () => {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

/**
 * Create a new holiday package
 */
const createHolidayPackage = async (packageData) => {
  try {
    if (!packageData.id) {
      packageData.id = uuidv4();
    }
    
    const holidayPackage = new HolidayPackage(packageData);
    await holidayPackage.save();
    return holidayPackage;
  } catch (error) {
    throw new Error(`Failed to create holiday package: ${error.message}`);
  }
};

/**
 * Get all holiday packages
 */
const getAllHolidayPackages = async () => {
  try {
    const packages = await HolidayPackage.find().sort({ createdAt: -1 });
    return packages;
  } catch (error) {
    throw new Error(`Failed to retrieve holiday packages: ${error.message}`);
  }
};

/**
 * Get holiday package by ID
 */
const getHolidayPackageById = async (id) => {
  try {
    const package = await HolidayPackage.findOne({ id });
    
    if (!package) {
      throw new Error('Holiday package not found');
    }
    
    return package;
  } catch (error) {
    throw new Error(`Failed to retrieve holiday package: ${error.message}`);
  }
};

/**
 * Update holiday package
 */
const updateHolidayPackage = async (id, updateData) => {
  try {
    const package = await HolidayPackage.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!package) {
      throw new Error('Holiday package not found');
    }
    
    return package;
  } catch (error) {
    throw new Error(`Failed to update holiday package: ${error.message}`);
  }
};

/**
 * Delete holiday package
 */
const deleteHolidayPackage = async (id) => {
  try {
    const package = await HolidayPackage.findOneAndDelete({ id });
    
    if (!package) {
      throw new Error('Holiday package not found');
    }
    
    return package;
  } catch (error) {
    throw new Error(`Failed to delete holiday package: ${error.message}`);
  }
};

/**
 * Search holiday packages by criteria
 */
const searchHolidayPackages = async (criteria) => {
  try {
    const query = {};
    
    if (criteria.packageName) query.packageName = { $regex: criteria.packageName, $options: 'i' };
    if (criteria.address) query.address = { $regex: criteria.address, $options: 'i' };
    if (criteria.minPrice) query.startingPrice = { $gte: criteria.minPrice };
    if (criteria.maxPrice) {
      query.startingPrice = query.startingPrice || {};
      query.startingPrice.$lte = criteria.maxPrice;
    }
    if (criteria.minDays) query['duration.days'] = { $gte: criteria.minDays };
    if (criteria.maxDays) {
      query['duration.days'] = query['duration.days'] || {};
      query['duration.days'].$lte = criteria.maxDays;
    }
    if (criteria.availableSeats) query.seats = { $gte: criteria.availableSeats };
    
    const packages = await HolidayPackage.find(query).sort({ startingPrice: 1 });
    return packages;
  } catch (error) {
    throw new Error(`Failed to search holiday packages: ${error.message}`);
  }
};

/**
 * Update package seats after booking
 */
const updatePackageSeats = async (packageId, requestedSeats) => {
  try {
    const package = await HolidayPackage.findOne({ id: packageId });
    
    if (!package) {
      throw new Error('Holiday package not found');
    }
    
    if (package.seats < requestedSeats) {
      throw new Error('Requested seats exceed available seats');
    }
    
    const updatedPackage = await HolidayPackage.findOneAndUpdate(
      { id: packageId },
      { $inc: { seats: -requestedSeats } },
      { new: true }
    );
    
    return updatedPackage;
  } catch (error) {
    throw new Error(`Failed to update package seats: ${error.message}`);
  }
};

module.exports = {
  createHolidayPackage,
  getAllHolidayPackages,
  getHolidayPackageById,
  updateHolidayPackage,
  deleteHolidayPackage,
  searchHolidayPackages,
  updatePackageSeats,
  generateBookingCode
};
