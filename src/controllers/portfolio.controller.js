const Portfolio = require('../models/portfolio.model');
const Partner = require('../models/partner.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Create or update portfolio
 * @route POST /api/portfolios
 * @access Private (partner)
 */
const createUpdatePortfolio = async (req, res) => {
  try {
    // Find partner profile
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Check if portfolio already exists
    let portfolio = await Portfolio.findOne({ partner: partner._id });

    if (portfolio) {
      // Update existing portfolio
      const { title, description, coverImage } = req.body;
      
      if (title) portfolio.title = title;
      if (description) portfolio.description = description;
      if (coverImage) portfolio.coverImage = coverImage;
      
      await portfolio.save();
    } else {
      // Create new portfolio
      portfolio = await Portfolio.create({
        partner: partner._id,
        ...req.body,
        items: [] // Initialize with empty items array
      });
    }

    return successResponse(res, 200, 'Portfolio updated successfully', { portfolio });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Add portfolio item
 * @route POST /api/portfolios/items
 * @access Private (partner)
 */
const addPortfolioItem = async (req, res) => {
  try {
    // Find partner profile
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Find portfolio
    let portfolio = await Portfolio.findOne({ partner: partner._id });
    if (!portfolio) {
      // Create portfolio if it doesn't exist
      portfolio = await Portfolio.create({
        partner: partner._id,
        title: 'My Portfolio',
        items: []
      });
    }

    // Add new item
    const newItem = {
      ...req.body,
      order: portfolio.items.length // Set order to current length (add at end)
    };

    portfolio.items.push(newItem);
    await portfolio.save();

    return successResponse(res, 201, 'Portfolio item added successfully', { 
      item: newItem,
      portfolio
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Update portfolio item
 * @route PUT /api/portfolios/items/:itemId
 * @access Private (partner)
 */
const updatePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Find partner profile
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Find portfolio
    const portfolio = await Portfolio.findOne({ partner: partner._id });
    if (!portfolio) {
      return errorResponse(res, 404, 'Portfolio not found');
    }

    // Find item index
    const itemIndex = portfolio.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return errorResponse(res, 404, 'Portfolio item not found');
    }

    // Update item
    portfolio.items[itemIndex] = {
      ...portfolio.items[itemIndex].toObject(),
      ...req.body,
      _id: portfolio.items[itemIndex]._id // Preserve the original ID
    };

    await portfolio.save();

    return successResponse(res, 200, 'Portfolio item updated successfully', {
      item: portfolio.items[itemIndex],
      portfolio
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Delete portfolio item
 * @route DELETE /api/portfolios/items/:itemId
 * @access Private (partner)
 */
const deletePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Find partner profile
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Find portfolio
    const portfolio = await Portfolio.findOne({ partner: partner._id });
    if (!portfolio) {
      return errorResponse(res, 404, 'Portfolio not found');
    }

    // Find item index
    const itemIndex = portfolio.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return errorResponse(res, 404, 'Portfolio item not found');
    }

    // Remove item
    portfolio.items.splice(itemIndex, 1);

    // Reorder remaining items
    portfolio.items.forEach((item, index) => {
      item.order = index;
    });

    await portfolio.save();

    return successResponse(res, 200, 'Portfolio item deleted successfully', { portfolio });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Reorder portfolio items
 * @route PUT /api/portfolios/reorder
 * @access Private (partner)
 */
const reorderPortfolioItems = async (req, res) => {
  try {
    const { itemOrders } = req.body;
    
    // Validate input
    if (!Array.isArray(itemOrders)) {
      return errorResponse(res, 400, 'Item orders must be an array');
    }
    
    // Find partner profile
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Find portfolio
    const portfolio = await Portfolio.findOne({ partner: partner._id });
    if (!portfolio) {
      return errorResponse(res, 404, 'Portfolio not found');
    }

    // Update orders
    for (const { itemId, order } of itemOrders) {
      const item = portfolio.items.find(item => item._id.toString() === itemId);
      if (item) {
        item.order = order;
      }
    }

    // Sort items by order
    portfolio.items.sort((a, b) => a.order - b.order);

    await portfolio.save();

    return successResponse(res, 200, 'Portfolio items reordered successfully', { portfolio });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get portfolio by partner ID
 * @route GET /api/portfolios/partner/:partnerId
 * @access Public
 */
const getPortfolioByPartnerId = async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    // Find portfolio
    const portfolio = await Portfolio.findOne({ partner: partnerId });
    if (!portfolio) {
      return errorResponse(res, 404, 'Portfolio not found');
    }

    // Sort items by order
    portfolio.items.sort((a, b) => a.order - b.order);

    return successResponse(res, 200, 'Portfolio retrieved successfully', { portfolio });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get own portfolio
 * @route GET /api/portfolios/me
 * @access Private (partner)
 */
const getOwnPortfolio = async (req, res) => {
  try {
    // Find partner profile
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return errorResponse(res, 404, 'Partner profile not found');
    }

    // Find portfolio
    const portfolio = await Portfolio.findOne({ partner: partner._id });
    if (!portfolio) {
      return successResponse(res, 200, 'Portfolio not found', { portfolio: null });
    }

    // Sort items by order
    portfolio.items.sort((a, b) => a.order - b.order);

    return successResponse(res, 200, 'Portfolio retrieved successfully', { portfolio });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createUpdatePortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  reorderPortfolioItems,
  getPortfolioByPartnerId,
  getOwnPortfolio
};