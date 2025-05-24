const express = require('express');
const {
  createInquiry,
  getClientInquiries,
  getInquiryById,
  updateInquiryStatus,
  bookPartner
} = require('../controllers/inquiry.controller');
const { protect, authorize } = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const { 
  createInquirySchema, 
  updateInquiryStatusSchema,
  bookPartnerSchema
} = require('../validations/inquiry.validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Create a new inquiry
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInquiry'
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', authorize('client'), validator(createInquirySchema), createInquiry);

/**
 * @swagger
 * /api/inquiries:
 *   get:
 *     summary: Get all inquiries for a client
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inquiries retrieved successfully
 */
router.get('/', authorize('client'), getClientInquiries);

/**
 * @swagger
 * /api/inquiries/{id}:
 *   get:
 *     summary: Get inquiry by ID
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inquiry retrieved successfully
 *       404:
 *         description: Inquiry not found
 */
router.get('/:id', getInquiryById);

/**
 * @swagger
 * /api/inquiries/{id}/status:
 *   put:
 *     summary: Update inquiry status
 *     tags: [Inquiry]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, assigned, responded, booked, completed, cancelled]
 *     responses:
 *       200:
 *         description: Inquiry status updated successfully
 *       404:
 *         description: Inquiry not found
 */
router.put('/:id/status', authorize('client'), validator(updateInquiryStatusSchema), updateInquiryStatus);

/**
 * @swagger
 * /api/inquiries/{id}/book:
 *   put:
 *     summary: Book a partner for an inquiry
 *     tags: [Inquiry]
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
 *               - partnerId
 *             properties:
 *               partnerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner booked successfully
 *       404:
 *         description: Inquiry not found
 */
router.put('/:id/book', authorize('client'), validator(bookPartnerSchema), bookPartner);

module.exports = router;