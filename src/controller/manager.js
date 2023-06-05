const { saveOrUpdateManagerInfo } = require("../services/manager");
const { getAllManagerInfo } = require("../services/manager");
const { getManagerInfo } = require("../services/manager");

exports.managerInfo = async (req, res) => {
    try {
        const { managerName, email, id } = req.body;

        // Validate request body
        if (!id || !managerName || !email) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request body',
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email',
            });
        }
        const managerInfo = req.body;
        const result = await saveOrUpdateManagerInfo(managerInfo);
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
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

exports.getManager = async (req, res) => {
    try {
        const result = await getManagerInfo(req.query);
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
exports.getAllManager = async (req, res) => {
    try {

        const result = await getAllManagerInfo(req);
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
