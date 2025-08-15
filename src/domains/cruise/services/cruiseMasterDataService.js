const CruiseMasterData = require('../models/CruiseMasterData');

/**
 * Get or create master data document
 */
const getOrCreateMasterData = async () => {
  try {
    let masterData = await CruiseMasterData.findOne();
    
    if (!masterData) {
      masterData = new CruiseMasterData({
        cruiseLines: [],
        ships: []
      });
      await masterData.save();
    }
    
    return masterData;
  } catch (error) {
    throw new Error(`Failed to get or create master data: ${error.message}`);
  }
};

/**
 * Get all cruise lines
 */
const getAllCruiseLines = async () => {
  try {
    const masterData = await getOrCreateMasterData();
    return masterData.cruiseLines;
  } catch (error) {
    throw new Error(`Failed to retrieve cruise lines: ${error.message}`);
  }
};

/**
 * Add a new cruise line
 */
const addCruiseLine = async (cruiseLineData) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    // Check if cruise line already exists
    const existingCruiseLine = masterData.cruiseLines.find(
      line => line.name.toLowerCase() === cruiseLineData.name.toLowerCase()
    );
    
    if (existingCruiseLine) {
      throw new Error('Cruise line already exists');
    }
    
    masterData.cruiseLines.push(cruiseLineData);
    await masterData.save();
    
    return cruiseLineData;
  } catch (error) {
    throw new Error(`Failed to add cruise line: ${error.message}`);
  }
};

/**
 * Update cruise line
 */
const updateCruiseLine = async (cruiseLineName, updateData) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    const cruiseLineIndex = masterData.cruiseLines.findIndex(
      line => line.name.toLowerCase() === cruiseLineName.toLowerCase()
    );
    
    if (cruiseLineIndex === -1) {
      throw new Error('Cruise line not found');
    }
    
    masterData.cruiseLines[cruiseLineIndex] = {
      ...masterData.cruiseLines[cruiseLineIndex],
      ...updateData
    };
    
    await masterData.save();
    return masterData.cruiseLines[cruiseLineIndex];
  } catch (error) {
    throw new Error(`Failed to update cruise line: ${error.message}`);
  }
};

/**
 * Delete cruise line
 */
const deleteCruiseLine = async (cruiseLineName) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    const cruiseLineIndex = masterData.cruiseLines.findIndex(
      line => line.name.toLowerCase() === cruiseLineName.toLowerCase()
    );
    
    if (cruiseLineIndex === -1) {
      throw new Error('Cruise line not found');
    }
    
    // Remove associated ships
    masterData.ships = masterData.ships.filter(
      ship => ship.cruiseLine.toLowerCase() !== cruiseLineName.toLowerCase()
    );
    
    // Remove cruise line
    masterData.cruiseLines.splice(cruiseLineIndex, 1);
    
    await masterData.save();
    return { message: 'Cruise line and associated ships deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete cruise line: ${error.message}`);
  }
};

/**
 * Get all ships
 */
const getAllShips = async () => {
  try {
    const masterData = await getOrCreateMasterData();
    return masterData.ships;
  } catch (error) {
    throw new Error(`Failed to retrieve ships: ${error.message}`);
  }
};

/**
 * Get ships by cruise line
 */
const getShipsByCruiseLine = async (cruiseLine) => {
  try {
    const masterData = await getOrCreateMasterData();
    const ships = masterData.ships.filter(
      ship => ship.cruiseLine.toLowerCase() === cruiseLine.toLowerCase()
    );
    return ships;
  } catch (error) {
    throw new Error(`Failed to retrieve ships by cruise line: ${error.message}`);
  }
};

/**
 * Add a new ship
 */
const addShip = async (shipData) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    // Check if ship already exists for this cruise line
    const existingShip = masterData.ships.find(
      ship => ship.name.toLowerCase() === shipData.name.toLowerCase() &&
              ship.cruiseLine.toLowerCase() === shipData.cruiseLine.toLowerCase()
    );
    
    if (existingShip) {
      throw new Error('Ship already exists for this cruise line');
    }
    
    // Verify cruise line exists
    const cruiseLineExists = masterData.cruiseLines.find(
      line => line.name.toLowerCase() === shipData.cruiseLine.toLowerCase()
    );
    
    if (!cruiseLineExists) {
      throw new Error('Cruise line does not exist');
    }
    
    masterData.ships.push(shipData);
    await masterData.save();
    
    return shipData;
  } catch (error) {
    throw new Error(`Failed to add ship: ${error.message}`);
  }
};

/**
 * Update ship
 */
const updateShip = async (shipName, cruiseLine, updateData) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    const shipIndex = masterData.ships.findIndex(
      ship => ship.name.toLowerCase() === shipName.toLowerCase() &&
              ship.cruiseLine.toLowerCase() === cruiseLine.toLowerCase()
    );
    
    if (shipIndex === -1) {
      throw new Error('Ship not found');
    }
    
    masterData.ships[shipIndex] = {
      ...masterData.ships[shipIndex],
      ...updateData
    };
    
    await masterData.save();
    return masterData.ships[shipIndex];
  } catch (error) {
    throw new Error(`Failed to update ship: ${error.message}`);
  }
};

/**
 * Delete ship
 */
const deleteShip = async (shipName, cruiseLine) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    const shipIndex = masterData.ships.findIndex(
      ship => ship.name.toLowerCase() === shipName.toLowerCase() &&
              ship.cruiseLine.toLowerCase() === cruiseLine.toLowerCase()
    );
    
    if (shipIndex === -1) {
      throw new Error('Ship not found');
    }
    
    masterData.ships.splice(shipIndex, 1);
    await masterData.save();
    
    return { message: 'Ship deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete ship: ${error.message}`);
  }
};

module.exports = {
  getAllCruiseLines,
  addCruiseLine,
  updateCruiseLine,
  deleteCruiseLine,
  getAllShips,
  getShipsByCruiseLine,
  addShip,
  updateShip,
  deleteShip
};
