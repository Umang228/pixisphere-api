const User = require('../models/user.model');
const { generateToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Register a new user
 * @route POST /api/auth/signup
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 400, 'User with this email already exists');
    }

    // Validate role
    const validRoles = ['client', 'partner', 'admin'];
    if (role && !validRoles.includes(role)) {
      return errorResponse(res, 400, 'Invalid role specified');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'client' // Default to client if not specified
    });

    // Generate token
    const token = generateToken({ id: user._id });

    // Return success with user data and token
    return successResponse(res, 201, 'User registered successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken({ id: user._id });

    // Return success with user data and token
    return successResponse(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Send OTP to user's phone (mock implementation)
 * @route POST /api/auth/send-otp
 * @access Public
 */
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !phone.match(/^[6-9]\d{9}$/)) {
      return errorResponse(res, 400, 'Invalid phone number');
    }

    // In a real implementation, we would send an OTP to the phone number
    // For this mock implementation, we'll always use '123456' as the OTP

    // Return success response
    return successResponse(res, 200, 'OTP sent successfully', {
      phone,
      // In a real implementation, we wouldn't return the OTP
      // We're doing it here just for testing purposes
      otp: '123456'
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Verify OTP (mock implementation)
 * @route POST /api/auth/verify-otp
 * @access Public
 */
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validate phone number
    if (!phone || !phone.match(/^[6-9]\d{9}$/)) {
      return errorResponse(res, 400, 'Invalid phone number');
    }

    // Validate OTP
    if (!otp) {
      return errorResponse(res, 400, 'OTP is required');
    }

    // In a real implementation, we would verify the OTP against what we sent
    // For this mock implementation, we'll always accept '123456' as the valid OTP
    if (otp !== '123456') {
      return errorResponse(res, 400, 'Invalid OTP');
    }

    // Check if user exists with this phone number
    let user = await User.findOne({ phone });

    if (!user) {
      // If user doesn't exist, create a new user with phone number only
      // In a real implementation, we might redirect to registration instead
      user = await User.create({
        name: `User ${phone.substr(6)}`, // Generate a placeholder name
        email: `user${phone}@pixisphere.com`, // Generate a placeholder email
        password: Math.random().toString(36).slice(-8), // Generate a random password
        phone
      });
    }

    // Generate token
    const token = generateToken({ id: user._id });

    // Return success with user data and token
    return successResponse(res, 200, 'OTP verified successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User profile retrieved successfully', { user });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
  getMe
};