const express = require('express');
const {
  createUpdatePortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  reorderPortfolioItems,
  getPortfolioByPartnerId,
  getOwnPortfolio
} = require('../controllers/portfolio.controller');
const { protect, authorize } = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const {
  portfolioSchema,
  portfolioItemSchema,
  reorderItemsSchema
} = require('../validations/portfolio.validation');

const router = express.Router();

/**
 * @swagger
 * /api/portfolios/partner/{partnerId}:
 *   get:
 *     summary: Get portfolio by partner ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
 *       404:
 *         description: Portfolio not found
 */
router.get('/partner/:partnerId', getPortfolioByPartnerId);

// The following routes require authentication and partner role
router.use(protect, authorize('partner'));

/**
 * @swagger
 * /api/portfolios:
 *   post:
 *     summary: Create or update portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validator(portfolioSchema), createUpdatePortfolio);

/**
 * @swagger
 * /api/portfolios/me:
 *   get:
 *     summary: Get own portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
 */
router.get('/me', getOwnPortfolio);

/**
 * @swagger
 * /api/portfolios/items:
 *   post:
 *     summary: Add portfolio item
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioItem'
 *     responses:
 *       201:
 *         description: Portfolio item added successfully
 *       400:
 *         description: Validation error
 */
router.post('/items', validator(portfolioItemSchema), addPortfolioItem);

/**
 * @swagger
 * /api/portfolios/items/{itemId}:
 *   put:
 *     summary: Update portfolio item
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioItem'
 *     responses:
 *       200:
 *         description: Portfolio item updated successfully
 *       404:
 *         description: Portfolio item not found
 */
router.put('/items/:itemId', validator(portfolioItemSchema), updatePortfolioItem);

/**
 * @swagger
 * /api/portfolios/items/{itemId}:
 *   delete:
 *     summary: Delete portfolio item
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio item deleted successfully
 *       404:
 *         description: Portfolio item not found
 */
router.delete('/items/:itemId', deletePortfolioItem);

/**
 * @swagger
 * /api/portfolios/reorder:
 *   put:
 *     summary: Reorder portfolio items
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemOrders
 *             properties:
 *               itemOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - itemId
 *                     - order
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: Portfolio items reordered successfully
 *       400:
 *         description: Validation error
 */
router.put('/reorder', validator(reorderItemsSchema), reorderPortfolioItems);

module.exports = router;