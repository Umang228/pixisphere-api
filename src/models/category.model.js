const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    iconUrl: {
      type: String
    },
    coverImageUrl: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Add indexes
categorySchema.index({ displayOrder: 1 });
categorySchema.index({ slug: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;