const { validateHolidayPackage } = require('../../../utils/validation');
const holidayService = require('../services/holidayService');

const createOrUpdateHolidayPackage = async (req, res) => {
    try {
        const { error, value } = validateHolidayPackage(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await holidayService.createOrUpdateHolidayPackage(value, req.files);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create or update holiday package' });
    }
};

const getAllHolidayPackages = async (req, res) => {
    try {
        const result = await holidayService.getAllHolidayPackages();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch holiday packages' });
    }
};

const deleteHolidayPackage = async (req, res) => {
    try {
        const result = await holidayService.deleteHolidayPackage(req.params.packageId);
        return result.success
            ? res.status(204).json({ message: result.message })
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete holiday package' });
    }
};

const searchHolidayPackageById = async (req, res) => {
    try {
        const result = await holidayService.searchHolidayPackageById(req.params.packageId);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch holiday package' });
    }
};

module.exports = {
    createOrUpdateHolidayPackage,
    getAllHolidayPackages,
    deleteHolidayPackage,
    searchHolidayPackageById,
};