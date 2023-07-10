const Joi = require('joi');
const { postMultipleAvailability } = require('../services/availability');

const availabilitySchema = Joi.object({
  id: Joi.string().required(),
  dateTime: Joi.string().isoDate().required(),
});

const multipleAvailabilityController = async (req, res) => {
  try {
    const pathSchema = Joi.object({
      language: Joi.string().required(),
      adults: Joi.number().integer().required(),
      children: Joi.number().integer().required(),
      infants: Joi.number().integer().required(),
    });

    const { error: pathError, value: pathData } = pathSchema.validate(req.params);
    if (pathError) {
      res.status(400).json({
        success: false,
        error: pathError.details[0].message
      });
      return;
    }

    const { error: bodyError, value: availabilityData } = Joi.array().items(availabilitySchema).validate(req.body);

    if (bodyError) {
      res.status(400).json({ success: false, error: bodyError.details[0].message });
      return;
    }
    console.log(pathData);
    console.log(availabilityData);
    const response = await postMultipleAvailability({
      ...pathData,
      availabilityData,
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  multipleAvailabilityController,
};
