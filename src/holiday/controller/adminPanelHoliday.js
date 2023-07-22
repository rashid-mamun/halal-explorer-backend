const { v4: uuidv4 } = require('uuid');
const holidayPackageService = require('../services/adminPanelHoliday');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ''); // Make sure the "uploads" directory exists
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// const upload = multer({
//   storage: storage,
// }).fields([
//   { name: 'coverImage', maxCount: 1 },
//   { name: 'durationDescription[0][image]', maxCount: 1 }, // Add this line for the specific field
// ]);
const validateHolidayPackage = (data) => {
  const Joi = require('joi');

  const schema = Joi.object({
    id: Joi.string(),
    packageName: Joi.string().required(),
    address: Joi.string().required(),
    duration: Joi.object({
      days: Joi.number().integer().min(1).required(),
      nights: Joi.number().integer().min(1).required(),
    }).required(),
    startingPrice: Joi.number().min(0).required(),
    description: Joi.string().required(),
    whatsIncluded: Joi.array().items(Joi.string()).required(),
    geoLocation: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).required(),
    coverImage: Joi.string(),
    durationDescription: Joi.array().items(Joi.object({
      titles: Joi.string().required(),
      food: Joi.string().required(),
      des: Joi.string().required(),
      image: Joi.string(), // Assuming 'image' is a file path
    })).required(),
    paxWisePrice: Joi.object({
      adult: Joi.number().integer().min(0).required(),
      child: Joi.number().integer().min(0).required(),
      infant: Joi.number().integer().min(0).required(),
    }).required(),
    departureDates: Joi.array().items(Joi.date().iso()).required(),
    seats: Joi.number().integer().min(0).required(),
    optionalTours: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      description: Joi.array().items(Joi.string()).required(),
    })),
  });

  return schema.validate(data);

};


const createOrUpdateHolidayPackage = async (req, res) => {
  try {
    const coverImageFiles = req.files['coverImage'];
    const galleryFiles = req.files['gallery'];
    console.log(req.files);

    // Handle the files for each field separately
    if (!coverImageFiles || coverImageFiles.length === 0 || !galleryFiles || galleryFiles.length === 0) {
      return res.status(400).send('Please upload files for both fields.');
    }
    const { id } = req.params;
    const packageData = req.body;
    console.log(req.file);

    if (!id) {
      packageData.id = uuidv4();
    }
    const { error } = validateHolidayPackage(packageData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.files) {
      return res.status(400).json({ error: 'Cover image is missing.' });
    }
    packageData.coverImage = req.files.coverImage[0].path;
    if (req.files) {
      packageData.durationDescription.forEach((item, index) => {
        if (req.files[index]) {
          item.image = req.files[index].path;
        }
      });
    }

    if (id) {
      const updatedPackage = await holidayPackageService.updateHolidayPackage(id, packageData);
      return res.status(200).json(updatedPackage);
    } else {
      const createdPackage = await holidayPackageService.createHolidayPackage(packageData);
      return res.status(201).json(createdPackage);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};


module.exports = {
  createOrUpdateHolidayPackage,
  upload,
};



