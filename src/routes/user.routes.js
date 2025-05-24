const express = require('express');
const User = require('../models/user.model');
const { protect } = require('../middlewares/auth');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    return successResponse(res, 200, 'User profile retrieved successfully', { user });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 */
router.put('/profile', protect, async (req, res) => {
  try {
    // Only allow updating certain fields
    const { name, phone, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    return successResponse(res, 200, 'User profile updated successfully', { user });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

module.exports = router;