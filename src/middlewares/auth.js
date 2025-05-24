const { verifyToken } = require('../utils/jwtUtils');
const { errorResponse } = require('../utils/responseHandler');
const User = require('../models/user.model');

/**
 * Middleware to protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return errorResponse(res, 401, 'Not authorized, no token provided');
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(res, 401, 'Not authorized, invalid token');
    }

    // Add user to request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized');
  }
};

/**
 * Middleware to authorize based on user role
 * @param {...String} roles - Allowed roles for the route
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res, 
        403, 
        `User role ${req.user.role} is not authorized to access this route`
      );
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};