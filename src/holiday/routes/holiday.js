const express = require('express');
const router = express.Router();
const adminHolidayController = require('../controller/adminPanelHoliday');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, ''));
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname);
    },
});


const upload = multer({ storage });

// Handle the image upload route for multiple images for each field
router.post('/admin', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'gallery', maxCount: 8 },
]), adminHolidayController.createOrUpdateHolidayPackage);

module.exports = router;
