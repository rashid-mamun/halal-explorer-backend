// availabilityService.js

const axios = require('axios');

const checkAvailability = async ({
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
}) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-api/1.0/availability/${language}/from/${fromType}/${fromCode}/to/${toType}/${toCode}/${outbound}/${inbound}/${adults}/${children}/${infants}`;

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      return {
        success: false,
        error: `Request failed with status code ${response.status}`,
      };
    }

    if (!response.data) {
      return {
        success: false,
        error: 'Unable to fetch the requested data. Please try again later.',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to check availability',
    };
  }
};
const getMultipleAvailability = async (language, adults, children, infants, allowPartialResults, vehicle, type, category, routes) => {
    const apiUrl = 'https://api.test.hotelbeds.com/transfer-api/1.0/availability/routes';
    const url = `${apiUrl}/${language}/${adults}/${children}/${infants}`;
  
    const params = {
      allowPartialResults,
      vehicle,
      type,
      category,
    };
  
    try {
      const response = await axios.post(url, routes, { params });
  
      if (response.status !== 200) {
        return {
          success: false,
          error: `Request failed with status code ${response.status}`,
        };
      }
  
      if (!response.data) {
        return {
          success: false,
          error: "Unable to fetch the availability data. Please try again later.",
        };
      }
  
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "Failed to fetch availability data",
      };
    }
  };
module.exports = {
  checkAvailability,
  getMultipleAvailability
};
