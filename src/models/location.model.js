const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    isActive: {
      type: Boolean,
      default: true
    },
    popularity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Add compound index for unique cities per state/country
locationSchema.index({ city: 1, state: 1, country: 1 }, { unique: true });
locationSchema.index({ popularity: -1 });

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;