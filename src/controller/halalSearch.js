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
