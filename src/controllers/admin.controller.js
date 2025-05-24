const User = require('../models/user.model');
const Partner = require('../models/partner.model');
const Inquiry = require('../models/inquiry.model');
const Portfolio = require('../models/portfolio.model');
const Category = require('../models/postgresql/category.model');
const Location = require('../models/postgresql/location.model');
const Review = require('../models/postgresql/review.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Get system statistics
 * @route GET /api/admin/stats
 * @access Private (admin)
 */
const getStats = async (req, res) => {
  try {
    // Get counts
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalPartners = await User.countDocuments({ role: 'partner' });
    const pendingVerifications = await Partner.countDocuments({ 'verificationStatus.status': 'pending' });
    const totalInquiries = await Inquiry.countDocuments();
    const completedInquiries = await Inquiry.countDocuments({ status: 'completed' });
    const totalPortfolioItems = await Portfolio.aggregate([
      { $unwind: '$items' },
      { $count: 'total' }
    ]).then(result => (result[0]?.total || 0));

    // Get counts by category
    const inquiriesByCategory = await Inquiry.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get counts by status
    const inquiriesByStatus = await Inquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get counts by location
    const inquiriesByLocation = await Inquiry.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const stats = {
      counts: {
        totalClients,
        totalPartners,
        pendingVerifications,
        totalInquiries,
        completedInquiries,
        totalPortfolioItems
      },
      analytics: {
        inquiriesByCategory,
        inquiriesByStatus,
        inquiriesByLocation
      }
    };

    return successResponse(res, 200, 'Statistics retrieved successfully', { stats });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get all partner verification requests
 * @route GET /api/admin/verifications
 * @access Private (admin)
 */
const getVerificationRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query['verificationStatus.status'] = status;
    }

    // Get partners with pending verification
    const partners = await Partner.find(query)
      .populate('user', 'name email phone')
      .sort({ 'verificationStatus.updatedAt': -1, createdAt: -1 });

    return successResponse(res, 200, 'Verification requests retrieved successfully', { partners });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Update partner verification status
 * @route PUT /api/admin/verify/:id
 * @access Private (admin)
 */
const updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return errorResponse(res, 400, 'Status must be either "approved" or "rejected"');
    }

    // Find partner
    const partner = await Partner.findById(id);
    if (!partner) {
      return errorResponse(res, 404, 'Partner not found');
    }

    // Update verification status
    partner.verificationStatus = {
      status,
      comment: comment || '',
      updatedAt: new Date(),
      updatedBy: req.user._id
    };

    await partner.save();

    return successResponse(res, 200, `Partner verification ${status}`, { partner });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Create a new category
 * @route POST /api/admin/categories
 * @access Private (admin)
 */
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, iconUrl, coverImageUrl, displayOrder } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return errorResponse(res, 400, 'Category with this slug already exists');
    }

    // Create category
    const category = await Category.create({
      name,
      slug,
      description,
      iconUrl,
      coverImageUrl,
      displayOrder: displayOrder || 0
    });

    return successResponse(res, 201, 'Category created successfully', { category });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get all categories
 * @route GET /api/admin/categories
 * @access Private (admin)
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });

    return successResponse(res, 200, 'Categories retrieved successfully', { categories });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Update category
 * @route PUT /api/admin/categories/:id
 * @access Private (admin)
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    // Update category
    await category.update(req.body);

    return successResponse(res, 200, 'Category updated successfully', { category });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Delete category
 * @route DELETE /api/admin/categories/:id
 * @access Private (admin)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    // Delete category
    await category.destroy();

    return successResponse(res, 200, 'Category deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Create a new location
 * @route POST /api/admin/locations
 * @access Private (admin)
 */
const createLocation = async (req, res) => {
  try {
    const { city, state, country, pincode, latitude, longitude } = req.body;

    // Check if location already exists
    const existingLocation = await Location.findOne({
      where: { city, state, country: country || 'India' }
    });
    
    if (existingLocation) {
      return errorResponse(res, 400, 'Location already exists');
    }

    // Create location
    const location = await Location.create({
      city,
      state,
      country: country || 'India',
      pincode,
      latitude,
      longitude
    });

    return successResponse(res, 201, 'Location created successfully', { location });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get all locations
 * @route GET /api/admin/locations
 * @access Private (admin)
 */
const getLocations = async (req, res) => {
  try {
    const { state } = req.query;
    
    // Build query
    const where = {};
    if (state) {
      where.state = state;
    }

    const locations = await Location.findAll({
      where,
      order: [['popularity', 'DESC'], ['city', 'ASC']]
    });

    return successResponse(res, 200, 'Locations retrieved successfully', { locations });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Update location
 * @route PUT /api/admin/locations/:id
 * @access Private (admin)
 */
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find location
    const location = await Location.findByPk(id);
    if (!location) {
      return errorResponse(res, 404, 'Location not found');
    }

    // Update location
    await location.update(req.body);

    return successResponse(res, 200, 'Location updated successfully', { location });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Delete location
 * @route DELETE /api/admin/locations/:id
 * @access Private (admin)
 */
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find location
    const location = await Location.findByPk(id);
    if (!location) {
      return errorResponse(res, 404, 'Location not found');
    }

    // Delete location
    await location.destroy();

    return successResponse(res, 200, 'Location deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get all reviews
 * @route GET /api/admin/reviews
 * @access Private (admin)
 */
const getReviews = async (req, res) => {
  try {
    const { status, partnerId } = req.query;
    
    // Build query
    const where = {};
    if (status) {
      where.status = status;
    }
    if (partnerId) {
      where.partnerId = partnerId;
    }

    const reviews = await Review.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, 200, 'Reviews retrieved successfully', { reviews });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Update review
 * @route PUT /api/admin/reviews/:id
 * @access Private (admin)
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, moderationComment } = req.body;
    
    // Find review
    const review = await Review.findByPk(id);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    // Update review
    await review.update({
      status,
      moderationComment,
      moderatedBy: req.user._id.toString(),
      moderatedAt: new Date()
    });

    return successResponse(res, 200, 'Review updated successfully', { review });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Feature a partner
 * @route PUT /api/admin/partners/:id/feature
 * @access Private (admin)
 */
const featurePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    
    // Find partner
    const partner = await Partner.findById(id);
    if (!partner) {
      return errorResponse(res, 404, 'Partner not found');
    }

    // Update featured status
    partner.featured = featured;
    await partner.save();

    return successResponse(
      res, 
      200, 
      `Partner ${featured ? 'featured' : 'unfeatured'} successfully`, 
      { partner }
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getStats,
  getVerificationRequests,
  updateVerificationStatus,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  getReviews,
  updateReview,
  featurePartner
};