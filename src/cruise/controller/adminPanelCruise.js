const Joi = require('joi');
const {
    createCruisePackage,
    getAllCruisePackages,
    getAllCruiseLines,
    getAllShipsByCruiseLine,
    addCruiseLine,
    addShip

} = require('../services/adminPanelCruise');

// Define Joi schema for validation
// const cruisePackageSchema = Joi.object({
//     destination: Joi.string().required(),
//     cruiseLine: Joi.string().required(),
//     ship: Joi.array().items(
//         Joi.object().keys({
//             amaWaterways: Joi.string().allow(''),
//             azamara: Joi.string().allow(''),
//             carnivalCruiseLines: Joi.string().allow(''),
//             celebrityCruises: Joi.string().allow(''),
//             costaCruises: Joi.string().allow(''),
//             crystal: Joi.string().allow(''),
//             disneyCruiseLine: Joi.string().allow(''),
//             hollandAmerica: Joi.string().allow(''),
//             hurtigrutenExpeditions: Joi.string().allow(''),
//             hurtigrutenNorwegianCoastalExpress: Joi.string().allow(''),
//             mscCruises: Joi.string().allow(''),
//             norwegianCruiseLine: Joi.string().allow(''),
//             regentSevenSeas: Joi.string().allow(''),
//             royalCaribbean: Joi.string().allow(''),
//             seabourn: Joi.string().allow(''),
//             uniworldBoutiqueRiverCruises: Joi.string().allow(''),
//             vikingOcean: Joi.string().allow(''),
//             vikingRiver: Joi.string().allow(''),
//             windstar: Joi.string().allow('')
//         })
//     ),
//     sailingDates: Joi.array().items(Joi.string().required()).required(),
//     length: Joi.string().required(),
//     commentForLength: Joi.string(),
//     itinerary: Joi.array().items(
//         Joi.object().required()
//     ),
//     gallery: Joi.array().items(Joi.string().required()),
//     shipFacts: Joi.array().items(
//         Joi.object().required()
//     ),
//     shipInfo: Joi.array().items(
//         Joi.object().required()
//     ),
//     policies: Joi.array().items(
//         Joi.object().required()
//     ),
//     roomTypes: Joi.array().items(
//         Joi.object().required()
//     ),
//     price: Joi.array().items(
//         Joi.object().required()
//     )
// });
const cruisePackageSchema = Joi.object({
    destination: Joi.string().required(),
    cruiseLine: Joi.string().required(),
    ship: Joi.string().allow(''),
    sailingDates: Joi.array().items(Joi.string().isoDate()).required(),
    length: Joi.string().required(),
    commentForLength: Joi.string(),
    itinerary: Joi.array().items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
    shipFacts: Joi.array().items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
    shipInfo: Joi.array().items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
    policies: Joi.array().items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
    roomTypes: Joi.array().items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
    price: Joi.object({
      startsFrom: Joi.string().required(),
    }),
    gallery: Joi.array().items(Joi.string().required()),
  });

async function createCruisePackageController(req, res) {
    try {
        // Validate the request body using Joi schema
        const { error: validationError } = cruisePackageSchema.validate(req.body, {
            abortEarly: false,
        });

        if (validationError) {
            // If validation fails, return the error details
            const validationErrorMessage = validationError.details.map((err) => err.message);
            return res.status(400).json({ error: validationErrorMessage });
        }

        // Prepare the cruise package data object
        const {
            destination,
            cruiseLine,
            ship,
            sailingDates,
            length,
            commentForLength,
            itinerary,
            gallery,
            shipFacts,
            shipInfo,
            policies,
            roomTypes,
            price,
        } = req.body;

        const cruisePackageData = {
            destination,
            cruiseLine,
            ship,
            sailingDates,
            length,
            commentForLength,
            itinerary,
            gallery,
            shipFacts,
            shipInfo,
            policies,
            roomTypes,
            price,
        };

        // Save the cruise package
        const result = await createCruisePackage(cruisePackageData);

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (err) {
        console.error('Error creating cruise package:', err);
        return res.status(500).json({ error: 'Failed to create cruise package.' });
    }
}
async function getAllCruisePackagesController(req, res) {
    try {
        const cruisePackages = await getAllCruisePackages();
        res.status(200).json(cruisePackages);
    } catch (err) {
        console.error('Error fetching cruise packages:', err);
        res.status(500).json({ error: 'Failed to fetch cruise packages.' });
    }
}
const cruiseLineSchema = Joi.object({
  cruiseLine: Joi.string().required(),
});

const shipSchema = Joi.object({
  cruiseLine: Joi.string().required(),
  ship: Joi.string().required(),
});

async function getAllCruiseLinesController(req, res) {
  try {
    const cruiseLines = await getAllCruiseLines();
    res.status(200).json(cruiseLines);
  } catch (err) {
    console.error('Error fetching cruise lines:', err);
    res.status(500).json({ error: 'Failed to fetch cruise lines.' });
  }
}

async function addCruiseLineController(req, res) {
  try {
    const { error } = cruiseLineSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const validationErrorMessage = error.details.map((err) => err.message);
      return res.status(400).json({ error: validationErrorMessage });
    }

    const { cruiseLine } = req.body;
    const cruiseLineData = { cruiseLine };

    const result = await addCruiseLine(cruiseLineData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    console.error('Error adding cruise line:', err);
    return res.status(500).json({ error: 'Failed to add cruise line.' });
  }
}

async function getAllShipsController(req, res) {
  try {
    const { cruiseLine } = req.query;
    const { error } = Joi.string().required().validate(cruiseLine);

    if (error) {
      return res.status(400).json({ error: 'Missing cruiseLine parameter in query.' });
    }

    const ships = await getAllShipsByCruiseLine(cruiseLine);
    res.status(200).json(ships);
  } catch (err) {
    console.error('Error fetching ships:', err);
    res.status(500).json({ error: 'Failed to fetch ships.' });
  }
}

async function addShipController(req, res) {
  try {
    const { error } = shipSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const validationErrorMessage = error.details.map((err) => err.message);
      return res.status(400).json({ error: validationErrorMessage });
    }

    const { cruiseLine, ship } = req.body;
    const shipData = { cruiseLine, ship };

    const result = await addShip(shipData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    console.error('Error adding ship:', err);
    return res.status(500).json({ error: 'Failed to add ship.' });
  }
}

module.exports = {
    createCruisePackageController,
    getAllCruisePackagesController,
    getAllCruiseLinesController,
    addCruiseLineController,
    getAllShipsController,
    addShipController,
};
