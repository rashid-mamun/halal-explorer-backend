const cruiseMasterDataService = require('../services/cruiseMasterDataService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Get all cruise lines
 */
const getAllCruiseLines = async (req, res) => {
  try {
    const cruiseLines = await cruiseMasterDataService.getAllCruiseLines();
    sendSuccessResponse(res, 'Cruise lines retrieved successfully', cruiseLines);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add a new cruise line
 */
const addCruiseLine = async (req, res) => {
  try {
    const cruiseLine = await cruiseMasterDataService.addCruiseLine(req.body);
    sendSuccessResponse(res, 'Cruise line added successfully', cruiseLine);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update cruise line
 */
const updateCruiseLine = async (req, res) => {
  try {
    const { cruiseLineName } = req.params;
    const cruiseLine = await cruiseMasterDataService.updateCruiseLine(cruiseLineName, req.body);
    sendSuccessResponse(res, 'Cruise line updated successfully', cruiseLine);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete cruise line
 */
const deleteCruiseLine = async (req, res) => {
  try {
    const { cruiseLineName } = req.params;
    const result = await cruiseMasterDataService.deleteCruiseLine(cruiseLineName);
    sendSuccessResponse(res, result.message);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all ships
 */
const getAllShips = async (req, res) => {
  try {
    const ships = await cruiseMasterDataService.getAllShips();
    sendSuccessResponse(res, 'Ships retrieved successfully', ships);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get ships by cruise line
 */
const getShipsByCruiseLine = async (req, res) => {
  try {
    const { cruiseLine } = req.params;
    const ships = await cruiseMasterDataService.getShipsByCruiseLine(cruiseLine);
    sendSuccessResponse(res, 'Ships retrieved successfully', ships);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add a new ship
 */
const addShip = async (req, res) => {
  try {
    const ship = await cruiseMasterDataService.addShip(req.body);
    sendSuccessResponse(res, 'Ship added successfully', ship);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update ship
 */
const updateShip = async (req, res) => {
  try {
    const { shipName, cruiseLine } = req.params;
    const ship = await cruiseMasterDataService.updateShip(shipName, cruiseLine, req.body);
    sendSuccessResponse(res, 'Ship updated successfully', ship);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete ship
 */
const deleteShip = async (req, res) => {
  try {
    const { shipName, cruiseLine } = req.params;
    const result = await cruiseMasterDataService.deleteShip(shipName, cruiseLine);
    sendSuccessResponse(res, result.message);
  } catch (error) {
    sendErrorResponse(res, error.message);
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
