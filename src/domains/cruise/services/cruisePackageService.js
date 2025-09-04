const CruisePackage = require('../models/CruisePackage');
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
 * Create a new cruise package
 */
const createCruisePackage = async (packageData) => {
  try {
    if (!packageData.id) {
      packageData.id = uuidv4();
    }
    
    const cruisePackage = new CruisePackage(packageData);
    await cruisePackage.save();
    return cruisePackage;
  } catch (error) {
    throw new Error(`Failed to create cruise package: ${error.message}`);
  }
};

/**
 * Get all cruise packages
 */
const getAllCruisePackages = async () => {
  try {
    const packages = await CruisePackage.find().sort({ createdAt: -1 });
    return packages;
  } catch (error) {
    throw new Error(`Failed to retrieve cruise packages: ${error.message}`);
  }
};

/**
 * Get cruise package by ID
 */
const getCruisePackageById = async (id) => {
  try {
    const cruisePackage = await CruisePackage.findOne({ id: id });
    
    if (!cruisePackage) {
      throw new Error('Cruise package not found');
    }
    
    return cruisePackage;
  } catch (error) {
    throw new Error(`Failed to retrieve cruise package: ${error.message}`);
  }
};

/**
 * Update cruise package
 */
const updateCruisePackage = async (id, updateData) => {
  try {
    const cruisePackage = await CruisePackage.findOneAndUpdate(
      { id: id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!cruisePackage) {
      throw new Error('Cruise package not found');
    }
    
    return cruisePackage;
  } catch (error) {
    throw new Error(`Failed to update cruise package: ${error.message}`);
  }
};

/**
 * Delete cruise package
 */
const deleteCruisePackage = async (id) => {
  try {
    const cruisePackage = await CruisePackage.findOneAndDelete({ id: id });
    
    if (!cruisePackage) {
      throw new Error('Cruise package not found');
    }
    
    return cruisePackage;
  } catch (error) {
    throw new Error(`Failed to delete cruise package: ${error.message}`);
  }
};

/**
 * Search cruise packages by criteria
 */
const searchCruisePackages = async (criteria) => {
  try {
    const query = {};
    
    if (criteria.destination) query.destination = { $regex: criteria.destination, $options: 'i' };
    if (criteria.cruiseLine) query.cruiseLine = { $regex: criteria.cruiseLine, $options: 'i' };
    if (criteria.ship) query.ship = { $regex: criteria.ship, $options: 'i' };
    if (criteria.minPrice) query['price.startsFrom'] = { $gte: criteria.minPrice };
    if (criteria.maxPrice) {
      query['price.startsFrom'] = query['price.startsFrom'] || {};
      query['price.startsFrom'].$lte = criteria.maxPrice;
    }
    if (criteria.sailingDate) query.sailingDates = { $gte: new Date(criteria.sailingDate) };
    
    const packages = await CruisePackage.find(query).sort({ createdAt: -1 });
    return packages;
  } catch (error) {
    throw new Error(`Failed to search cruise packages: ${error.message}`);
  }
};

module.exports = {
  createCruisePackage,
  getAllCruisePackages,
  getCruisePackageById,
  updateCruisePackage,
  deleteCruisePackage,
  searchCruisePackages,
  generateBookingCode
};
