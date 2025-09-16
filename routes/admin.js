const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth'); // Import both from the same module
const adminController = require('../controllers/adminController');

// Admin-only routes
router.get('/dashboard', auth, isAdmin, adminController.getDashboard);
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);

module.exports = router;
