const express = require('express');
const router = express.Router();
const upload = require('./multerConfig');
const adminCruiseController = require('../controller/adminPanelCruise');
const cruiseController = require('../controller/cruise');
const adminPanelcruiseController = require('../controller/adminPanelCruise');
const { handleMulterError, handleServerError } = require('../middleware/errorHandler');

router.post('/enquiry', cruiseController.createCruiseEnquiry);
router.get('/enquiry', cruiseController.getCruiseEnquiries);
router.post('/admin', adminPanelcruiseController.createCruisePackageController);
router.put('/admin/:id', adminPanelcruiseController.updateCruisePackageController);
router.get('/admin/:id', adminPanelcruiseController.getCruisePackageByIdController);
router.delete('/admin/:id', adminPanelcruiseController.deleteCruisePackageByIdController);
router.get('/admin', adminPanelcruiseController.getAllCruisePackagesController);

router.get('/cruiselines', adminPanelcruiseController.getAllCruiseLinesController);
router.post('/cruiselines', adminPanelcruiseController.addCruiseLineController);
router.get('/ships', adminPanelcruiseController.getAllShipsController);
router.post('/ships', adminPanelcruiseController.addShipController);

router.use(handleServerError);

module.exports = router;
