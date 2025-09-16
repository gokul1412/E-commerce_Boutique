const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import controllers and middleware
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// =====================
// User Routes (Authenticated)
// =====================

// Create a new order
router.post(
  '/',
  auth.verifyToken,
  body('total').isFloat({ gt: 0 }).withMessage('Total must be greater than 0'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  orderController.createOrder
);

// Get all orders for the logged-in user
router.get('/', auth.verifyToken, orderController.getUserOrders);

// Get a single order by ID (must belong to the logged-in user)
router.get('/:id', auth.verifyToken, orderController.getOrder);

// =====================
// Admin Routes
// =====================

// Update order status (Admin only)
router.put(
  '/:id/status',
  auth.verifyToken,
  auth.isAdmin,
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  orderController.updateOrderStatus
);

module.exports = router;
