const Joi = require('joi');

const createActivityBookingSchema = Joi.object({
  availabilityRequestId: Joi.string().required(),
  activityCode: Joi.string().required(),
  language: Joi.string().required(),
  clientReference: Joi.string().required(),
  holder: Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    zipCode: Joi.string().required(),
    mailing: Joi.boolean().required(),
    mailUpdDate: Joi.date().iso().required(),
    country: Joi.string().required(),
    surname: Joi.string().required(),
    telephones: Joi.array().items(Joi.string()).optional()
  }).required(),
  activities: Joi.array().items(
    Joi.object({
      preferedLanguage: Joi.string().required(),
      serviceLanguage: Joi.string().required(),
      rateKey: Joi.string().required(),
      from: Joi.date().iso().required(),
      to: Joi.date().iso().required(),
      paxes: Joi.array().items(
        Joi.object({
          age: Joi.number().min(0).required(),
          name: Joi.string().required(),
          type: Joi.string().valid('ADULT', 'CHILD').required(),
          surname: Joi.string().required()
        })
      ).required()
    })
  ).min(1).required()
});

const updateActivityBookingSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional(),
  hotelBedsReference: Joi.string().optional(),
  holder: Joi.object({
    name: Joi.string().optional(),
    title: Joi.string().optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    mailing: Joi.boolean().optional(),
    mailUpdDate: Joi.date().iso().optional(),
    country: Joi.string().optional(),
    surname: Joi.string().optional(),
    telephones: Joi.array().items(Joi.string()).optional()
  }).optional(),
  activities: Joi.array().items(
    Joi.object({
      preferedLanguage: Joi.string().optional(),
      serviceLanguage: Joi.string().optional(),
      rateKey: Joi.string().optional(),
      from: Joi.date().iso().optional(),
      to: Joi.date().iso().optional(),
      paxes: Joi.array().items(
        Joi.object({
          age: Joi.number().min(0).optional(),
          name: Joi.string().optional(),
          type: Joi.string().valid('ADULT', 'CHILD').optional(),
          surname: Joi.string().optional()
        })
      ).optional()
    })
  ).optional()
});

const getActivityBookingSchema = Joi.object({
  bookingId: Joi.string().required()
});

const getAllActivityBookingsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const searchActivityBookingsSchema = Joi.object({
  activityCode: Joi.string().optional(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional(),
  email: Joi.string().email().optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(1000).default(100)
});

const deleteActivityBookingSchema = Joi.object({
  bookingId: Joi.string().required()
});

const confirmBookingSchema = Joi.object({
  language: Joi.string().required(),
  clientReference: Joi.string().required(),
  holder: Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    zipCode: Joi.string().required(),
    mailing: Joi.boolean().required(),
    mailUpdDate: Joi.date().iso().required(),
    country: Joi.string().required(),
    surname: Joi.string().required(),
    telephones: Joi.array().items(Joi.string()).required()
  }).required(),
  activities: Joi.array().items(
    Joi.object({
      preferedLanguage: Joi.string().required(),
      serviceLanguage: Joi.string().required(),
      rateKey: Joi.string().required(),
      from: Joi.date().iso().required(),
      to: Joi.date().iso().required(),
      paxes: Joi.array().items(
        Joi.object({
          age: Joi.number().min(0).required(),
          name: Joi.string().required(),
          type: Joi.string().valid('ADULT', 'CHILD').required(),
          surname: Joi.string().required()
        })
      ).required()
    })
  ).min(1).required()
});

const cancelBookingSchema = Joi.object({
  bookingId: Joi.string().required(),
  cancellationData: Joi.object({
    reason: Joi.string().optional(),
    cancellationCode: Joi.string().optional()
  }).optional()
});

const getBookingStatisticsSchema = Joi.object({});

module.exports = {
  createActivityBookingSchema,
  updateActivityBookingSchema,
  getActivityBookingSchema,
  getAllActivityBookingsSchema,
  searchActivityBookingsSchema,
  deleteActivityBookingSchema,
  confirmBookingSchema,
  cancelBookingSchema,
  getBookingStatisticsSchema
};
