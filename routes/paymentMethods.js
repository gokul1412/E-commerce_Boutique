const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const { auth } = require('../middleware/auth'); // Destructure auth from the exported object

// All payment method routes require authentication
router.use(auth);

// Get all payment methods
router.get('/', paymentMethodController.getPaymentMethods);

// Get a specific payment method
router.get('/:paymentMethodId', paymentMethodController.getPaymentMethod);

// Add a new payment method
router.post('/', paymentMethodController.addPaymentMethod);

// Update a payment method
router.put('/:paymentMethodId', paymentMethodController.updatePaymentMethod);

// Delete a payment method
router.delete('/:paymentMethodId', paymentMethodController.deletePaymentMethod);

// Set a payment method as default
router.put('/:paymentMethodId/default', paymentMethodController.setDefaultPaymentMethod);

module.exports = router;