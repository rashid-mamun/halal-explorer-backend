const { saveOrUpdateHotelInfo } = require("../services/halalRating");
const { getAllHalalHotelInfo } = require("../services/halalRating");
const { getHalalHotelInfo } = require("../services/halalRating");
const halalService = require("../services/index");

exports.halalSearch = async (req, res) => {
  req = req.query;
  try {
      console.log("---- halal search calling----------", req);
      if (!req.city) {
          return res.status(500).json({
              success: false,
              error: 'please provide all necessary request property'
          })
      }
      const hotels = await halalService.searchHalalHotels(req);
      return res.json(hotels);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};
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
exports.getHalalHotel = async (req, res) => {
  try {
    const result = await getHalalHotelInfo(req.query);
    // console.log(JSON.stringify(result,null,2));
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data:result.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message:result.message,
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
exports.getAllHalalHotel = async (req, res) => {
  try {
   
    const result = await getAllHalalHotelInfo(req);
    // console.log(JSON.stringify(result,null,2));
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data:result.data
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
