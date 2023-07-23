const express = require('express');
const router = express.Router();
const upload = require('./multerConfig');
const adminHolidayController = require('../controller/adminPanelHoliday');
const holidayController = require('../controller/holiday');
const { handleMulterError, handleServerError } = require('../middleware/errorHandler');

router.post('/admin', (req, res, next) => {
    upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])(req, res, (err) => {
        if (err) {
            handleMulterError(err, req, res, next);
        } else {
            adminHolidayController.createOrUpdateHolidayPackage(req, res);
        }
    });
});
router.get('/packages', adminHolidayController.getAllHolidayPackages);
router.delete('/packages/:id', adminHolidayController.deleteHolidayPackage);
router.get('/packages/search/:id', adminHolidayController.searchHolidayPackageById);
router.post('/book', holidayController.createBooking);
router.get('/book/all', holidayController.getAllBookings);
router.get('/book', holidayController.getBookingById);

router.use(handleServerError);

module.exports = router;
