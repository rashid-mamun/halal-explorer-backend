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
router.get('/admin', adminPanelcruiseController.getAllCruisePackagesController);

router.use(handleServerError);

module.exports = router;
