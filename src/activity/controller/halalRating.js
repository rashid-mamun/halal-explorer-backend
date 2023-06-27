const {
  saveOrUpdateActivityInfo,
  getAllHalalActivityInfo,
  getHalalActivityInfo,
  saveOrUpdateStructure,
  getHalalRatingStructure
} = require("../services/halalRating");
const halalService = require("../services/index");
const Joi = require('joi');

const activityInfoSchema = Joi.object({
  code: Joi.string().required(),
  ratings: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

const structureSchema = Joi.object({
  ratings: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});
const getHalalActivitySchema = Joi.object({
  code: Joi.string().required()
});
exports.halalSearch = async (req, res) => {
  const { city } = req.query;

  try {
    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'Please provide the city parameter.'
      });
    }

    const Activitys = await halalService.searchHalalActivitys(req.query);
    return res.json(Activitys);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.rateActivity = async (req, res) => {
  try {
    const { error } = activityInfoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const ActivityInfo = req.body;
    const result = await saveOrUpdateActivityInfo(ActivityInfo);
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

exports.halalRatingStructure = async (req, res) => {
  try {
    const { error } = structureSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const structureInfo = req.body;
    const result = await saveOrUpdateStructure(structureInfo);
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

exports.getHalalRatingStructure = async (req, res) => {
  try {
    const result = await getHalalRatingStructure(req.query);
    // console.log(JSON.stringify(result,null,2));
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message,
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
exports.getHalalActivity = async (req, res) => {
  const { error, value } = getHalalActivitySchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  try {
    const result = await getHalalActivityInfo(value.code);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message,
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
exports.getAllHalalActivity = async (req, res) => {
  try {

    const result = await getAllHalalActivityInfo(req);
    // console.log(JSON.stringify(result,null,2));
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
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
