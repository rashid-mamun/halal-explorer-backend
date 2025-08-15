const InsuranceConfig = require('../models/InsuranceConfig');

/**
 * Get or create insurance configuration
 */
const getOrCreateConfig = async () => {
  try {
    let config = await InsuranceConfig.findOne();
    
    if (!config) {
      config = new InsuranceConfig({
        travellerTypes: [],
        policyTypes: [],
        areas: [],
        restTypes: [],
        productNames: [],
        ageGroups: [],
        countries: [],
        durations: []
      });
      await config.save();
    }
    
    return config;
  } catch (error) {
    throw new Error(`Failed to get or create insurance config: ${error.message}`);
  }
};

/**
 * Add traveller type
 */
const addTravellerType = async (travellerType) => {
  try {
    const config = await getOrCreateConfig();
    
    // Check if already exists
    const exists = config.travellerTypes.some(type => type.name === travellerType.name);
    if (exists) {
      throw new Error('Traveller type already exists');
    }
    
    config.travellerTypes.push(travellerType);
    await config.save();
    
    return config.travellerTypes;
  } catch (error) {
    throw new Error(`Failed to add traveller type: ${error.message}`);
  }
};

/**
 * Add policy type
 */
const addPolicyType = async (policyType) => {
  try {
    const config = await getOrCreateConfig();
    
    const exists = config.policyTypes.some(type => type.name === policyType.name);
    if (exists) {
      throw new Error('Policy type already exists');
    }
    
    config.policyTypes.push(policyType);
    await config.save();
    
    return config.policyTypes;
  } catch (error) {
    throw new Error(`Failed to add policy type: ${error.message}`);
  }
};

/**
 * Add area
 */
const addArea = async (area) => {
  try {
    const config = await getOrCreateConfig();
    
    const exists = config.areas.some(a => a.name === area.name);
    if (exists) {
      throw new Error('Area already exists');
    }
    
    config.areas.push(area);
    await config.save();
    
    return config.areas;
  } catch (error) {
    throw new Error(`Failed to add area: ${error.message}`);
  }
};

/**
 * Add rest type
 */
const addRestType = async (restType) => {
  try {
    const config = await getOrCreateConfig();
    
    const exists = config.restTypes.some(type => type.name === restType.name);
    if (exists) {
      throw new Error('Rest type already exists');
    }
    
    config.restTypes.push(restType);
    await config.save();
    
    return config.restTypes;
  } catch (error) {
    throw new Error(`Failed to add rest type: ${error.message}`);
  }
};

/**
 * Add product name
 */
const addProductName = async (productName) => {
  try {
    const config = await getOrCreateConfig();
    
    const exists = config.productNames.some(name => name.name === productName.name);
    if (exists) {
      throw new Error('Product name already exists');
    }
    
    config.productNames.push(productName);
    await config.save();
    
    return config.productNames;
  } catch (error) {
    throw new Error(`Failed to add product name: ${error.message}`);
  }
};

/**
 * Add age group
 */
const addAgeGroup = async (ageGroup) => {
  try {
    const config = await getOrCreateConfig();
    
    // Check for overlapping age ranges
    const overlaps = config.ageGroups.some(group => 
      (ageGroup.minAge <= group.maxAge && ageGroup.maxAge >= group.minAge)
    );
    
    if (overlaps) {
      throw new Error('Age group overlaps with existing age group');
    }
    
    config.ageGroups.push(ageGroup);
    await config.save();
    
    return config.ageGroups;
  } catch (error) {
    throw new Error(`Failed to add age group: ${error.message}`);
  }
};

/**
 * Add country
 */
const addCountry = async (country) => {
  try {
    const config = await getOrCreateConfig();
    
    const exists = config.countries.some(c => c.name === country.name || c.code === country.code);
    if (exists) {
      throw new Error('Country already exists');
    }
    
    config.countries.push(country);
    await config.save();
    
    return config.countries;
  } catch (error) {
    throw new Error(`Failed to add country: ${error.message}`);
  }
};

/**
 * Add duration
 */
const addDuration = async (duration) => {
  try {
    const config = await getOrCreateConfig();
    
    const exists = config.durations.some(d => d.days === duration.days);
    if (exists) {
      throw new Error('Duration already exists');
    }
    
    config.durations.push(duration);
    await config.save();
    
    return config.durations;
  } catch (error) {
    throw new Error(`Failed to add duration: ${error.message}`);
  }
};

/**
 * Get all configuration data
 */
const getAllConfig = async () => {
  try {
    const config = await getOrCreateConfig();
    return config;
  } catch (error) {
    throw new Error(`Failed to get configuration: ${error.message}`);
  }
};

/**
 * Get specific configuration section
 */
const getConfigSection = async (section) => {
  try {
    const config = await getOrCreateConfig();
    return config[section] || [];
  } catch (error) {
    throw new Error(`Failed to get ${section}: ${error.message}`);
  }
};

module.exports = {
  getOrCreateConfig,
  addTravellerType,
  addPolicyType,
  addArea,
  addRestType,
  addProductName,
  addAgeGroup,
  addCountry,
  addDuration,
  getAllConfig,
  getConfigSection
};
