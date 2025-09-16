const express = require('express');
const router = express.Router();
const recentlyViewedController = require('../controllers/recentlyViewedController');
const { auth } = require('../middleware/auth'); // Destructure auth from the exported object

// All recently viewed routes require authentication
router.use(auth);

// Get user's recently viewed products with optional limit
router.get('/', recentlyViewedController.getRecentlyViewed);

// Add a product to recently viewed
router.post('/', recentlyViewedController.addRecentlyViewed);

// Remove a product from recently viewed
router.delete('/:productId', recentlyViewedController.removeRecentlyViewed);

// Clear all recently viewed products
router.delete('/', recentlyViewedController.clearAllRecentlyViewed);

module.exports = router;