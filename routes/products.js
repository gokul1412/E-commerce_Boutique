// routes/products.js
const express = require('express');
const router = express.Router();

// Import controllers and middleware FIRST - NO DEBUG CODE BEFORE THIS
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// =====================
// Public Routes
// =====================

// Get all products
router.get('/', productController.getAllProducts);

// Search products
router.get('/search', productController.searchProducts);

// Get a single product by ID
router.get('/:id', productController.getProduct);

// =====================
// Admin-Only Routes
// =====================

// Create a new product
router.post('/', verifyToken, isAdmin, productController.createProduct);

// Update a product
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);

// Delete a product
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;