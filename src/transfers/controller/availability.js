const { checkAvailability } = require('../services/availability');
const Joi = require('joi');

const validateAvailabilityRequest = (req) => {
  const schema = Joi.object({
    language: Joi.string().required(),
    fromType: Joi.string().required(),
    fromCode: Joi.string().required(),
    toType: Joi.string().required(),
    toCode: Joi.string().required(),
    outbound: Joi.string().isoDate().required(),
    inbound: Joi.string().isoDate(),
    adults: Joi.number().integer().required(),
    children: Joi.number().integer().required(),
    infants: Joi.number().integer().required(),
  });

  return schema.validate(req);
};

const checkAvailabilityController = async (req, res) => {
  try {
    // Validate the request parameters
    const { error } = validateAvailabilityRequest(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Extract the validated request parameters
    const {
      language,
      fromType,
      fromCode,
      toType,
      toCode,
      outbound,
      inbound,
      adults,
      children,
      infants,
    } = req.params;

    // Call the service layer to check availability
    const availability = await checkAvailability({
      language,
      fromType,
      fromCode,
      toType,
      toCode,
      outbound,
      inbound,
      adults,
      children,
      infants,
    });

    // Send the availability response back to the client
    res.json(availability);
  } catch (error) {
    console.error(`Error checking availability: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const validateAvailability = (request) => {
    const schema = Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        dateTime: Joi.string().isoDate().required(),
      })
    );
  
    return schema.validate(request);
  };
  
  const postMultipleAvailabilityController = async (req, res) => {
    try {
      // Validate the request body
      const { error } = validateAvailability(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const { language, adults, children, infants, allowPartialResults, vehicle, type, category, routes } = req.body;
  
      const result = await getMultipleAvailability(language, adults, children, infants, allowPartialResults, vehicle, type, category, routes);
  
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error(`Error retrieving multiple availability: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
  checkAvailabilityController,
  postMultipleAvailabilityController,
};
