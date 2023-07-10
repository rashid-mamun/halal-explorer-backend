const Joi = require('joi');
const axios = require('axios');
const crypto = require('crypto');

const createHeaders = () => {
  const apiKey = process.env.HOTELBEDS_TRANSFERS_API_KEY;
  const secret = process.env.HOTELBEDS_TRANSFERS_SECRET;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHash('sha256')
    .update(apiKey + secret + timestamp)
    .digest('hex');

  return {
    Accept: 'application/json',
    'Api-key': apiKey,
    'X-Signature': signature,
    'Accept-Encoding': 'gzip',
  };
};

const fetchData = async (url, method, data, successMessage, errorMessage) => {
  const headers = createHeaders();

  try {
    const response = await axios({
      url,
      method: method.toLowerCase(),
      headers,
      data,
    });

    if (![200, 201].includes(response.status)) {
      return {
        success: false,
        error: `Request failed with status code ${response.status}`,
      };
    }

    if (!response.data) {
      return {
        success: false,
        error: "Unable to fetch the requested data. Please try again later.",
      };
    }

    return {
      success: true,
      message: successMessage,
      data: response.data.routes,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

const postMultipleAvailability = async ({ language, adults, children, infants, availabilityData }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-api/1.0/availability/routes/${language}/${adults}/${children}/${infants}`;

  const successMessage = 'Multiple availability request successful';
  const errorMessage = 'Failed to request multiple availabilities';

  const availabilitySchema = Joi.object({
    id: Joi.string().required(),
    dateTime: Joi.string().isoDate().required(),
  });

  const { error } = Joi.array().items(availabilitySchema).validate(availabilityData);

  if (error) {
    return {
      success: false,
      error: error.details[0].message,
    };
  }

  return fetchData(url, 'POST', availabilityData, successMessage, errorMessage);
};

module.exports = {
  postMultipleAvailability,
};
