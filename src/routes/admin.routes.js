const express = require('express');
const {
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
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const {
  verificationStatusSchema,
  categorySchema,
  locationSchema,
  reviewSchema,
  featurePartnerSchema
} = require('../validations/admin.validation');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, authorize('admin'));

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/admin/verifications:
 *   get:
 *     summary: Get all partner verification requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Verification requests retrieved successfully
 */
router.get('/verifications', getVerificationRequests);

/**
 * @swagger
 * /api/admin/verify/{id}:
 *   put:
 *     summary: Update partner verification status
 *     tags: [Admin]
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
 *                 enum: [approved, rejected]
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner verification updated
 *       404:
 *         description: Partner not found
 */
router.put('/verify/:id', validator(verificationStatusSchema), updateVerificationStatus);

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.post('/categories', validator(categorySchema), createCategory);

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/categories/:id', validator(categorySchema), updateCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/categories/:id', deleteCategory);

/**
 * @swagger
 * /api/admin/locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: Location created successfully
 *       400:
 *         description: Validation error
 */
router.post('/locations', validator(locationSchema), createLocation);

/**
 * @swagger
 * /api/admin/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
 */
router.get('/locations', getLocations);

/**
 * @swagger
 * /api/admin/locations/{id}:
 *   put:
 *     summary: Update location
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       404:
 *         description: Location not found
 */
router.put('/locations/:id', validator(locationSchema), updateLocation);

/**
 * @swagger
 * /api/admin/locations/{id}:
 *   delete:
 *     summary: Delete location
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 */
router.delete('/locations/:id', deleteLocation);

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       - in: query
 *         name: partnerId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/reviews', getReviews);

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   put:
 *     summary: Update review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *                 enum: [pending, approved, rejected]
 *               moderationComment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
router.put('/reviews/:id', validator(reviewSchema), updateReview);

/**
 * @swagger
 * /api/admin/partners/{id}/feature:
 *   put:
 *     summary: Feature a partner
 *     tags: [Admin]
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
 *               - featured
 *             properties:
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Partner featured status updated
 *       404:
 *         description: Partner not found
 */
router.put('/partners/:id/feature', validator(featurePartnerSchema), featurePartner);

module.exports = router;