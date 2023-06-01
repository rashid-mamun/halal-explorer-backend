const { saveOrUpdateHotelInfo } = require("../services/halalRating");

exports.halalRating = async (req, res) => {
  try {
    const { id, ratings } = req.body;

    // Validate request body
    if (!id || !Array.isArray(ratings) || !ratings.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
      });
    }

    const hotelInfo = req.body;
    const result = await saveOrUpdateHotelInfo(hotelInfo);
    // console.log(JSON.stringify(result,null,2));
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

