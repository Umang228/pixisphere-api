const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      enum: ['wedding', 'portrait', 'commercial', 'event', 'maternity', 'product', 'other'],
      required: [true, 'Category is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required']
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      pincode: String,
      address: String
    },
    budget: {
      min: {
        type: Number,
        required: [true, 'Minimum budget is required']
      },
      max: {
        type: Number,
        required: [true, 'Maximum budget is required']
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    referenceImageUrl: {
      type: String
    },
    requirements: [String],
    status: {
      type: String,
      enum: ['new', 'assigned', 'responded', 'booked', 'completed', 'cancelled'],
      default: 'new'
    },
    assignedPartners: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner'
    }],
    responses: [{
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
      },
      message: {
        type: String,
        required: true
      },
      quotation: {
        amount: Number,
        description: String,
        validUntil: Date
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    bookedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner'
    },
    leadMatchScore: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for frequently queried fields
inquirySchema.index({ client: 1 });
inquirySchema.index({ assignedPartners: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ category: 1, 'location.city': 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;