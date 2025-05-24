const express = require('express');
const { 
  createPartnerProfile, 
  getPartnerProfile, 
  updatePartnerProfile,
  getLeads,
  respondToLead,
  getPartnerStats
} = require('../controllers/partner.controller');
const { protect, authorize } = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const { 
  partnerProfileSchema, 
  updatePartnerProfileSchema,
  respondToLeadSchema
} = require('../validations/partner.validation');

const router = express.Router();

// All routes require authentication and partner role
router.use(protect, authorize('partner'));

/**
 * @swagger
 * /api/partners/profile:
 *   post:
 *     summary: Create partner profile
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartnerProfile'
 *     responses:
 *       201:
 *         description: Partner profile created successfully
 *       400:
 *         description: Validation error
 */
router.post('/profile', validator(partnerProfileSchema), createPartnerProfile);

/**
 * @swagger
 * /api/partners/profile:
 *   get:
 *     summary: Get partner profile
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partner profile retrieved successfully
 *       404:
 *         description: Partner profile not found
 */
router.get('/profile', getPartnerProfile);

/**
 * @swagger
 * /api/partners/profile:
 *   put:
 *     summary: Update partner profile
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePartnerProfile'
 *     responses:
 *       200:
 *         description: Partner profile updated successfully
 *       400:
 *         description: Validation error
 */
router.put('/profile', validator(updatePartnerProfileSchema), updatePartnerProfile);

/**
 * @swagger
 * /api/partners/leads:
 *   get:
 *     summary: Get leads assigned to partner
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by inquiry status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 */
router.get('/leads', getLeads);

/**
 * @swagger
 * /api/partners/leads/{id}/respond:
 *   post:
 *     summary: Respond to a lead
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               quotation:
 *                 type: object
 *     responses:
 *       200:
 *         description: Response submitted successfully
 *       404:
 *         description: Inquiry not found
 */
router.post('/leads/:id/respond', validator(respondToLeadSchema), respondToLead);

/**
 * @swagger
 * /api/partners/stats:
 *   get:
 *     summary: Get partner stats
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partner stats retrieved successfully
 */
router.get('/stats', getPartnerStats);

module.exports = router;