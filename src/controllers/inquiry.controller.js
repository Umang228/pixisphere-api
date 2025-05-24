const Inquiry = require('../models/inquiry.model');
const Partner = require('../models/partner.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Create a new inquiry
 * @route POST /api/inquiries
 * @access Private (client)
 */
const createInquiry = async (req, res) => {
  try {
    // Add client ID to the inquiry data
    const inquiryData = {
      ...req.body,
      client: req.user._id
    };

    // Create inquiry
    const inquiry = await Inquiry.create(inquiryData);

    // Find matching partners based on category and location
    await matchAndAssignPartners(inquiry);

    return successResponse(res, 201, 'Inquiry created successfully', { inquiry });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get all inquiries for a client
 * @route GET /api/inquiries
 * @access Private (client)
 */
const getClientInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ client: req.user._id })
      .populate('assignedPartners', 'businessName contactEmail rating')
      .populate('bookedPartner', 'businessName contactEmail rating')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Inquiries retrieved successfully', { inquiries });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get inquiry by ID
 * @route GET /api/inquiries/:id
 * @access Private
 */
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('assignedPartners', 'businessName contactEmail rating')
      .populate('bookedPartner', 'businessName contactEmail rating')
      .populate('responses.partner', 'businessName contactEmail rating');

    if (!inquiry) {
      return errorResponse(res, 404, 'Inquiry not found');
    }

    // Check if user is authorized to view this inquiry
    if (
      req.user.role === 'client' && inquiry.client.toString() !== req.user._id.toString() ||
      req.user.role === 'partner' && !inquiry.assignedPartners.some(p => p._id.toString() === req.user._id.toString())
    ) {
      return errorResponse(res, 403, 'Not authorized to view this inquiry');
    }

    return successResponse(res, 200, 'Inquiry retrieved successfully', { inquiry });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Update inquiry status
 * @route PUT /api/inquiries/:id/status
 * @access Private (client)
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);
    
    if (!inquiry) {
      return errorResponse(res, 404, 'Inquiry not found');
    }

    // Check if user is authorized to update this inquiry
    if (inquiry.client.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to update this inquiry');
    }

    // Update status
    inquiry.status = status;
    await inquiry.save();

    return successResponse(res, 200, 'Inquiry status updated successfully', { inquiry });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Book a partner for an inquiry
 * @route PUT /api/inquiries/:id/book
 * @access Private (client)
 */
const bookPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);
    
    if (!inquiry) {
      return errorResponse(res, 404, 'Inquiry not found');
    }

    // Check if user is authorized to book for this inquiry
    if (inquiry.client.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to book for this inquiry');
    }

    // Check if partner is assigned to this inquiry
    const isAssigned = inquiry.assignedPartners.some(
      p => p.toString() === partnerId
    );

    if (!isAssigned) {
      return errorResponse(res, 400, 'Selected partner is not assigned to this inquiry');
    }

    // Update inquiry
    inquiry.bookedPartner = partnerId;
    inquiry.status = 'booked';
    await inquiry.save();

    return successResponse(res, 200, 'Partner booked successfully', { inquiry });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Helper function to match and assign partners to an inquiry
 */
const matchAndAssignPartners = async (inquiry) => {
  // Find partners that match the inquiry criteria
  const matchingPartners = await Partner.find({
    categories: inquiry.category,
    'address.city': inquiry.location.city,
    verificationStatus: { status: 'approved' }
  }).limit(5);  // Limit to 5 partners

  // Assign partners to the inquiry
  if (matchingPartners.length > 0) {
    inquiry.assignedPartners = matchingPartners.map(partner => partner._id);
    inquiry.status = 'assigned';
    await inquiry.save();
  }

  return inquiry;
};

module.exports = {
  createInquiry,
  getClientInquiries,
  getInquiryById,
  updateInquiryStatus,
  bookPartner
};