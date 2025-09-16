const express = require('express');
const router = express.Router();

// Import controllers and middleware
const wishlistController = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth'); // Import auth function correctly

// All wishlist routes require authentication

// Get user's wishlist
router.get('/', auth, wishlistController.getWishlist);

// Add item to wishlist
router.post('/add', auth, wishlistController.addToWishlist);

// Remove item from wishlist
router.delete('/remove/:productId', auth, wishlistController.removeFromWishlist);

// Clear entire wishlist
router.delete('/clear', auth, wishlistController.clearWishlist);

module.exports = router;