const Joi = require('joi');

// Portfolio schema
const portfolioSchema = Joi.object({
  title: Joi.string().min(3).max(100).trim(),
  description: Joi.string().max(1000).trim(),
  coverImage: Joi.string().uri()
});

// Portfolio item schema
const portfolioItemSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).trim(),
  description: Joi.string().max(500).trim(),
  imageUrl: Joi.string().required().uri(),
  category: Joi.string()
    .valid('wedding', 'portrait', 'commercial', 'event', 'maternity', 'product', 'other')
    .required(),
  tags: Joi.array().items(Joi.string().trim()),
  featured: Joi.boolean(),
  location: Joi.string().trim(),
  dateShot: Joi.date()
});

// Reorder items schema
const reorderItemsSchema = Joi.object({
  itemOrders: Joi.array().items(
    Joi.object({
      itemId: Joi.string().required(),
      order: Joi.number().required().min(0)
    })
  ).min(1).required()
});

module.exports = {
  portfolioSchema,
  portfolioItemSchema,
  reorderItemsSchema
};