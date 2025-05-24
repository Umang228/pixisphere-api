const Joi = require('joi');

// Partner profile creation schema
const partnerProfileSchema = Joi.object({
  businessName: Joi.string().required().min(3).max(100).trim(),
  description: Joi.string().required().min(10).max(1000).trim(),
  address: Joi.object({
    street: Joi.string().trim(),
    city: Joi.string().required().trim(),
    state: Joi.string().required().trim(),
    pincode: Joi.string().required().pattern(/^\d{6}$/),
    country: Joi.string().default('India')
  }).required(),
  contactEmail: Joi.string().required().email().lowercase().trim(),
  contactPhone: Joi.string().required().pattern(/^[6-9]\d{9}$/),
  categories: Joi.array().items(
    Joi.string().valid('wedding', 'portrait', 'commercial', 'event', 'maternity', 'product', 'other')
  ).min(1).required(),
  services: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim(),
      description: Joi.string().trim(),
      priceRange: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0)
      })
    })
  ),
  documents: Joi.object({
    aadhaar: Joi.object({
      number: Joi.string().required().pattern(/^\d{12}$/)
    }).required(),
    pan: Joi.object({
      number: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    }),
    gst: Joi.object({
      number: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    })
  }).required(),
  yearsOfExperience: Joi.number().min(0),
  establishedYear: Joi.number().min(1900).max(new Date().getFullYear()),
  socialMedia: Joi.object({
    instagram: Joi.string().uri(),
    facebook: Joi.string().uri(),
    website: Joi.string().uri()
  })
});

// Partner profile update schema (similar to creation but fields are optional)
const updatePartnerProfileSchema = Joi.object({
  businessName: Joi.string().min(3).max(100).trim(),
  description: Joi.string().min(10).max(1000).trim(),
  address: Joi.object({
    street: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    pincode: Joi.string().pattern(/^\d{6}$/),
    country: Joi.string().default('India')
  }),
  contactEmail: Joi.string().email().lowercase().trim(),
  contactPhone: Joi.string().pattern(/^[6-9]\d{9}$/),
  categories: Joi.array().items(
    Joi.string().valid('wedding', 'portrait', 'commercial', 'event', 'maternity', 'product', 'other')
  ).min(1),
  services: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim(),
      description: Joi.string().trim(),
      priceRange: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0)
      })
    })
  ),
  documents: Joi.object({
    aadhaar: Joi.object({
      number: Joi.string().pattern(/^\d{12}$/)
    }),
    pan: Joi.object({
      number: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    }),
    gst: Joi.object({
      number: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    })
  }),
  yearsOfExperience: Joi.number().min(0),
  establishedYear: Joi.number().min(1900).max(new Date().getFullYear()),
  socialMedia: Joi.object({
    instagram: Joi.string().uri(),
    facebook: Joi.string().uri(),
    website: Joi.string().uri()
  })
});

// Schema for responding to a lead
const respondToLeadSchema = Joi.object({
  message: Joi.string().required().min(10).max(1000).trim(),
  quotation: Joi.object({
    amount: Joi.number().min(0).required(),
    description: Joi.string().min(10).max(500).trim(),
    validUntil: Joi.date().greater('now')
  })
});

module.exports = {
  partnerProfileSchema,
  updatePartnerProfileSchema,
  respondToLeadSchema
};