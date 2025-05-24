const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    address: {
      street: String,
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
      },
      country: {
        type: String,
        default: 'India'
      }
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number']
    },
    categories: [{
      type: String,
      enum: ['wedding', 'portrait', 'commercial', 'event', 'maternity', 'product', 'other'],
      required: [true, 'At least one category is required']
    }],
    services: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      priceRange: {
        min: Number,
        max: Number
      }
    }],
    documents: {
      aadhaar: {
        number: {
          type: String,
          required: [true, 'Aadhaar number is required'],
          match: [/^\d{12}$/, 'Please provide a valid 12-digit Aadhaar number']
        },
        verified: {
          type: Boolean,
          default: false
        }
      },
      pan: {
        number: {
          type: String,
          match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN number']
        },
        verified: {
          type: Boolean,
          default: false
        }
      },
      gst: {
        number: {
          type: String,
          match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please provide a valid GST number']
        },
        verified: {
          type: Boolean,
          default: false
        }
      }
    },
    verificationStatus: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      comment: String,
      updatedAt: Date,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    featured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0
    },
    establishedYear: Number,
    socialMedia: {
      instagram: String,
      facebook: String,
      website: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for portfolio
partnerSchema.virtual('portfolio', {
  ref: 'Portfolio',
  localField: '_id',
  foreignField: 'partner',
  justOne: true
});

// Virtual for inquiries
partnerSchema.virtual('inquiries', {
  ref: 'Inquiry',
  localField: '_id',
  foreignField: 'assignedPartners',
  justOne: false
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;