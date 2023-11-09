const Joi = require('joi');
const { saveOrUpdateManagerInfo, getAllManagerInfo, getManagerInfo, searchHalalManagerActivities } = require("../services/manager");

const managerInfoSchema = Joi.object({
  managerName: Joi.string().required(),
  email: Joi.string().email().required(),
  id: Joi.string().required(),
});

exports.managerInfo = async (req, res) => {
  try {
    const { error, value } = managerInfoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const result = await saveOrUpdateManagerInfo(value);

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
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
};

exports.getManagerInfo = async (req, res) => {
  try {
    const result = await getManagerInfo(req.query);

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
      error: err.message || 'Internal server error',
    });
  }
};
exports.managerSearch = async (req, res) => {
  const { city, activityName } = req.query;

  try {
    if (!city && !activityName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide the city or activityName parameter.'
      });
    }

    const activities = await searchHalalManagerActivities(req.query);
    return res.json(activities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllManagerInfo = async (req, res) => {
  try {
    const result = await getAllManagerInfo(req.query);

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
      error: err.message || 'Internal server error',
    });
  }
};
