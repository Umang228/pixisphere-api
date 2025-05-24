const User = require('../models/user.model');
const Partner = require('../models/partner.model');
const Inquiry = require('../models/inquiry.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Create partner profile
 * @route POST /api/partners/profile
 * @access Private (partner)
 */
const createPartnerProfile = async (req, res) => {
  try {
    // Check if partner profile already exists
    const existingProfile = await Partner.findOne({ user: req.user._id });
    if (existingProfile) {
      return errorResponse(res, 400, 'Partner profile already exists for this user');
    }

    // Create partner profile
    const partnerData = {
      user: req.user._id,
      ...req.body
    };

    const partner = await Partner.create(partnerData);

    return successResponse(res, 201, 'Partner profile created successfully', { partner });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get partner profile
 * @route GET /api/partners/profile
 * @access Private (partner)
 */
const getPartnerProfile = async (req, res) => {
  try {
    const partner = await Partner.findOne({ user: req.user._id });

    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    return successResponse(res, 200, 'Partner profile retrieved successfully', { partner });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Update partner profile
 * @route PUT /api/partners/profile
 * @access Private (partner)
 */
const updatePartnerProfile = async (req, res) => {
  try {
    const partner = await Partner.findOne({ user: req.user._id });

    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Prevent updating verification status directly
    const { verificationStatus, ...updateData } = req.body;

    // Update partner profile
    Object.assign(partner, updateData);
    await partner.save();

    return successResponse(res, 200, 'Partner profile updated successfully', { partner });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get leads assigned to partner
 * @route GET /api/partners/leads
 * @access Private (partner)
 */
const getLeads = async (req, res) => {
  try {
    const partner = await Partner.findOne({ user: req.user._id });

    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Get filter params
    const { status, category, city, startDate, endDate } = req.query;
    
    // Build query
    const query = { assignedPartners: partner._id };
    
    // Add filters if provided
    if (status) query.status = status;
    if (category) query.category = category;
    if (city) query['location.city'] = city;
    
    // Date range filter
    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) query.eventDate.$gte = new Date(startDate);
      if (endDate) query.eventDate.$lte = new Date(endDate);
    }

    // Get inquiries
    const inquiries = await Inquiry.find(query)
      .populate('client', 'name email phone')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Leads retrieved successfully', { inquiries });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Respond to a lead
 * @route POST /api/partners/leads/:id/respond
 * @access Private (partner)
 */
const respondToLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, quotation } = req.body;

    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return errorResponse(res, 404, 'Inquiry not found');
    }

    // Check if partner is assigned to this inquiry
    if (!inquiry.assignedPartners.includes(partner._id)) {
      return errorResponse(res, 403, 'You are not assigned to this inquiry');
    }

    // Check if partner has already responded
    const existingResponse = inquiry.responses.find(
      response => response.partner.toString() === partner._id.toString()
    );

    if (existingResponse) {
      // Update existing response
      existingResponse.message = message;
      if (quotation) existingResponse.quotation = quotation;
      existingResponse.createdAt = new Date();
    } else {
      // Add new response
      inquiry.responses.push({
        partner: partner._id,
        message,
        quotation,
        status: 'pending'
      });
    }

    // Update inquiry status if it's the first response
    if (inquiry.status === 'assigned') {
      inquiry.status = 'responded';
    }

    await inquiry.save();

    return successResponse(res, 200, 'Response submitted successfully', { inquiry });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get partner stats
 * @route GET /api/partners/stats
 * @access Private (partner)
 */
const getPartnerStats = async (req, res) => {
  try {
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Get inquiry stats
    const totalLeads = await Inquiry.countDocuments({ assignedPartners: partner._id });
    const respondedLeads = await Inquiry.countDocuments({ 
      assignedPartners: partner._id,
      'responses.partner': partner._id 
    });
    const bookedLeads = await Inquiry.countDocuments({ bookedPartner: partner._id });

    // Get portfolio stats (if needed)
    // const portfolioItems = await Portfolio.findOne({ partner: partner._id }).then(p => p?.items.length || 0);

    const stats = {
      totalLeads,
      respondedLeads,
      bookedLeads,
      responseRate: totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0,
      conversionRate: respondedLeads > 0 ? (bookedLeads / respondedLeads) * 100 : 0,
      rating: partner.rating,
      totalReviews: partner.totalReviews
    };

    return successResponse(res, 200, 'Partner stats retrieved successfully', { stats });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createPartnerProfile,
  getPartnerProfile,
  updatePartnerProfile,
  getLeads,
  respondToLead,
  getPartnerStats
};