const Joi = require('joi');

// Create inquiry schema
const createInquirySchema = Joi.object({
  category: Joi.string()
    .valid('wedding', 'portrait', 'commercial', 'event', 'maternity', 'product', 'other')
    .required(),
  title: Joi.string().required().min(5).max(100).trim(),
  description: Joi.string().required().min(10).max(1000).trim(),
  eventDate: Joi.date().required().greater('now'),
  location: Joi.object({
    city: Joi.string().required().trim(),
    state: Joi.string().required().trim(),
    pincode: Joi.string().pattern(/^\d{6}$/),
    address: Joi.string().trim()
  }).required(),
  budget: Joi.object({
    min: Joi.number().required().min(0),
    max: Joi.number().required().min(Joi.ref('min')),
    currency: Joi.string().default('INR')
  }).required(),
  referenceImageUrl: Joi.string().uri(),
  requirements: Joi.array().items(Joi.string().trim())
});

// Update inquiry status schema
const updateInquiryStatusSchema = Joi.object({
  status: Joi.string()
    .valid('new', 'assigned', 'responded', 'booked', 'completed', 'cancelled')
    .required()
});

// Book partner schema
const bookPartnerSchema = Joi.object({
  partnerId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Partner ID must be a valid MongoDB ObjectId'
    })
});

module.exports = {
  createInquirySchema,
  updateInquiryStatusSchema,
  bookPartnerSchema
};