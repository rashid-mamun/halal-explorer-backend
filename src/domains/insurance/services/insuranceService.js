const Insurance = require('../models/Insurance');

/**
 * Create a new insurance policy
 */
const createInsurance = async (insuranceData) => {
  try {
    const insurance = new Insurance(insuranceData);
    await insurance.save();
    return insurance;
  } catch (error) {
    throw new Error(`Failed to create insurance policy: ${error.message}`);
  }
};

/**
 * Get all insurance policies
 */
const getAllInsurances = async () => {
  try {
    const insurances = await Insurance.find().sort({ createdAt: -1 });
    return insurances;
  } catch (error) {
    throw new Error(`Failed to retrieve insurance policies: ${error.message}`);
  }
};

/**
 * Get insurance policy by ID
 */
const getInsuranceById = async (id) => {
  try {
    const insurance = await Insurance.findById(id);
    
    if (!insurance) {
      throw new Error('Insurance policy not found');
    }
    
    return insurance;
  } catch (error) {
    throw new Error(`Failed to retrieve insurance policy: ${error.message}`);
  }
};

/**
 * Update insurance policy
 */
const updateInsurance = async (id, updateData) => {
  try {
    const insurance = await Insurance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!insurance) {
      throw new Error('Insurance policy not found');
    }
    
    return insurance;
  } catch (error) {
    throw new Error(`Failed to update insurance policy: ${error.message}`);
  }
};

/**
 * Delete insurance policy
 */
const deleteInsurance = async (id) => {
  try {
    const insurance = await Insurance.findByIdAndDelete(id);
    
    if (!insurance) {
      throw new Error('Insurance policy not found');
    }
    
    return insurance;
  } catch (error) {
    throw new Error(`Failed to delete insurance policy: ${error.message}`);
  }
};

/**
 * Search insurance policies by criteria
 */
const searchInsurances = async (criteria) => {
  try {
    const query = {};
    
    if (criteria.travellerType) query.travellerType = criteria.travellerType;
    if (criteria.policyType) query.policyType = criteria.policyType;
    if (criteria.area) query.area = criteria.area;
    if (criteria.country) query.country = criteria.country;
    if (criteria.duration) query.duration = criteria.duration;
    if (criteria.minPremium) query.premium = { $gte: criteria.minPremium };
    if (criteria.maxPremium) {
      query.premium = query.premium || {};
      query.premium.$lte = criteria.maxPremium;
    }
    
    const insurances = await Insurance.find(query).sort({ premium: 1 });
    return insurances;
  } catch (error) {
    throw new Error(`Failed to search insurance policies: ${error.message}`);
  }
};

module.exports = {
  createInsurance,
  getAllInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
  searchInsurances
};
