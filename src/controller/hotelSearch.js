const hotelService = require("../services/hotelSearch");

exports.hotelSearch = async (req, res) => {
    req = req.query;
    try {
        console.log("---- hotel search calling----------", req);
        if (!req.city || !req.checkin || !req.checkout || !req.guests || !req.currency || !req.residency) {
            return res.status(500).json({
                success: false,
                error: 'please provide all necessary request property'
            })
        }
        const hotels = await hotelService.searchHotels(req);
        return res.json(hotels);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
