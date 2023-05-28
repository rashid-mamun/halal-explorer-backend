const hotelService = require("../services/index");

exports.hotelSearchDetails = async (req, res) => {
    req = req.query;
    try {
        console.log("---- hotel search Deatails calling----------", req);
        if ( !req.checkin || !req.checkout || !req.guests || !req.currency || !req.residency || !req.id) {
            return res.status(500).json({
                success: false,
                error: 'please provide all necessary request property'
            })
        }
        const hotels = await hotelService.searchHotelDetails(req);
        return res.json(hotels);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
