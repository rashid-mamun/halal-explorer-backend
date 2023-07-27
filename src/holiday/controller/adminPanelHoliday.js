const { v4: uuidv4 } = require('uuid');
const holidayPackageService = require('../services/adminPanelHoliday');
const Joi = require('joi');

const validateHolidayPackage = (data) => {
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
    gallery: Joi.string(),
    durationDescription: Joi.array().items(Joi.object({
      titles: Joi.string().required(),
      food: Joi.string().required(),
      des: Joi.string().required(),
    })).required(),
    paxWisePrice: Joi.object({
      adult: Joi.number().integer().min(0).required(),
      child: Joi.number().integer().min(0).required(),
      infant: Joi.number().integer().min(0).required(),
      single: Joi.number().integer().min(0).required(),
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
    if (!req.files || !req.files['coverImage'] || !req.files['gallery']) {
      return res.status(400).json({ error: 'Please upload files for both fields.' });
    }
    const { id } = req.body;
    const packageData = req.body;

    if (!id) {
      packageData.id = uuidv4();
    }
    const { error } = validateHolidayPackage(packageData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(JSON.stringify(req.files,null,2));

    packageData.coverImage = req.files.coverImage[0].path;
    packageData.gallery = req.files.gallery.map((file) => file.path);

     // Ensure the uploaded files have buffers before converting to base64
    // const coverImageFile = req.files['coverImage'][0];
    // const galleryFiles = req.files['gallery'];

    // if (!coverImageFile.buffer || galleryFiles.some((file) => !file.buffer)) {
    //   return res.status(400).json({ error: 'Uploaded files are not valid.' });
    // }

    // packageData.coverImage = coverImageFile.buffer.toString('base64');
    // packageData.gallery = galleryFiles.map((file) => file.buffer.toString('base64'));
    packageData.currency = 'AED';

    if (id) {
      const updatedPackage = await holidayPackageService.updateHolidayPackage(id, packageData);
      return res.status(200).json(updatedPackage);
    } else {
      const createdPackage = await holidayPackageService.createHolidayPackage(packageData);
      return res.status(201).json(createdPackage);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
const getAllHolidayPackages = async (req, res) => {
  try {
    const holidayPackages = await holidayPackageService.getAllHolidayPackages();
    return res.status(200).json(holidayPackages);
  } catch (error) {
    console.error('Failed to get holiday packages:', error);
    return res.status(500).json({ error: 'Failed to get holiday packages.' });
  }
};
const deleteHolidayPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await holidayPackageService.deleteHolidayPackage(id);
    return res.status(200).json(deleteResult);
  } catch (error) {
    console.error('Failed to delete holiday package:', error);
    return res.status(500).json({ error: 'Failed to delete holiday package.' });
  }
};

const searchHolidayPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const holidayPackage = await holidayPackageService.searchHolidayPackageById(id);
    return res.status(200).json(holidayPackage);
  } catch (error) {
    console.error('Failed to search for holiday package:', error);
    return res.status(500).json({ error: 'Failed to search for holiday package.' });
  }
};

module.exports = {
  createOrUpdateHolidayPackage,
  getAllHolidayPackages,
  deleteHolidayPackage,
  searchHolidayPackageById
};
