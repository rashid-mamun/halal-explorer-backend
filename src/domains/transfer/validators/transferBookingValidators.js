const Joi = require('joi');

/**
 * Validation schema for passenger details
 */
const passengerDetailsSchema = Joi.object({
  adults: Joi.number().integer().min(1).required(),
  children: Joi.number().integer().min(0).required(),
  infants: Joi.number().integer().min(0).required()
});

/**
 * Validation schema for selected vehicle
 */
const selectedVehicleSchema = Joi.object({
  vehicleCode: Joi.string().required(),
  vehicleName: Joi.string().required(),
  category: Joi.string().required(),
  transferType: Joi.string().required()
});

/**
 * Validation schema for pickup details
 */
const pickupDetailsSchema = Joi.object({
  location: Joi.string().required(),
  dateTime: Joi.string().isoDate().required(),
  flightNumber: Joi.string().optional(),
  remarks: Joi.string().optional()
});

/**
 * Validation schema for dropoff details
 */
const dropoffDetailsSchema = Joi.object({
  location: Joi.string().required(),
  dateTime: Joi.string().isoDate().required(),
  remarks: Joi.string().optional()
});

/**
 * Validation schema for pricing
 */
const pricingSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().required(),
  total: Joi.number().positive().required()
});

/**
 * Validation schema for customer info
 */
const customerInfoSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  nationality: Joi.string().optional()
});

/**
 * Validation schema for creating booking
 */
const createBookingSchema = Joi.object({
  availabilityRequestId: Joi.string().required(),
  routeId: Joi.string().required(),
  passengerDetails: passengerDetailsSchema.required(),
  selectedVehicle: selectedVehicleSchema.required(),
  pickupDetails: pickupDetailsSchema.required(),
  dropoffDetails: dropoffDetailsSchema.required(),
  pricing: pricingSchema.required(),
  customerInfo: customerInfoSchema.required()
});

/**
 * Validation schema for booking ID parameter
 */
const bookingIdSchema = Joi.object({
  bookingId: Joi.string().required()
});

/**
 * Validation schema for HotelBeds reference parameter
 */
const hotelBedsReferenceSchema = Joi.object({
  hotelBedsReference: Joi.string().required()
});

/**
 * Validation schema for email parameter
 */
const emailSchema = Joi.object({
  email: Joi.string().email().required()
});

/**
 * Validation schema for getting all bookings
 */
const getAllBookingsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed')
});

/**
 * Validation schema for getting bookings by email
 */
const getBookingsByEmailSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

/**
 * Validation schema for updating booking status
 */
const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').required()
});

module.exports = {
  createBookingSchema,
  bookingIdSchema,
  hotelBedsReferenceSchema,
  emailSchema,
  getAllBookingsSchema,
  getBookingsByEmailSchema,
  updateBookingStatusSchema
};
