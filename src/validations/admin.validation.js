const Joi = require('joi');

// Verification status update schema
const verificationStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  comment: Joi.string().trim().allow('')
});

// Category schema
const categorySchema = Joi.object({
  name: Joi.string().required().min(3).max(50).trim(),
  slug: Joi.string().required().min(3).max(50).trim(),
  description: Joi.string().trim().allow(''),
  iconUrl: Joi.string().uri().allow(''),
  coverImageUrl: Joi.string().uri().allow(''),
  isActive: Joi.boolean(),
  displayOrder: Joi.number().min(0)
});

// Location schema
const locationSchema = Joi.object({
  city: Joi.string().required().trim(),
  state: Joi.string().required().trim(),
  country: Joi.string().default('India').trim(),
  pincode: Joi.string().pattern(/^\d{6}$/).allow(''),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  isActive: Joi.boolean(),
  popularity: Joi.number().min(0)
});

// Review update schema
const reviewSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required(),
  moderationComment: Joi.string().trim().allow('')
});

// Feature partner schema
const featurePartnerSchema = Joi.object({
  featured: Joi.boolean().required()
});

module.exports = {
  verificationStatusSchema,
  categorySchema,
  locationSchema,
  reviewSchema,
  featurePartnerSchema
};