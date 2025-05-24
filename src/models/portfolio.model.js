const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    enum: ['wedding', 'portrait', 'commercial', 'event', 'maternity', 'product', 'other'],
    required: [true, 'Category is required']
  },
  tags: [String],
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  location: String,
  dateShot: Date
});

const portfolioSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
      unique: true
    },
    title: {
      type: String,
      default: 'My Portfolio'
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    coverImage: {
      type: String
    },
    items: [portfolioItemSchema]
  },
  {
    timestamps: true
  }
);

// Add index for sorting portfolio items by order
portfolioSchema.index({ 'items.order': 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;