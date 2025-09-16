const PaymentMethod = require('../models/paymentMethod');

/**
 * Get all payment methods for the authenticated user
 */
exports.getPaymentMethods = async (req, res) => {
  try {
    const results = await PaymentMethod.getUserPaymentMethods(req.user.id);

    // Mask card numbers for security
    const maskedResults = results.map(method => ({
      ...method,
      card_number: maskCardNumber(method.card_number)
    }));

    res.json({ paymentMethods: maskedResults });
  } catch (error) {
    console.error('Error in getPaymentMethods controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Get a specific payment method
 */
exports.getPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const result = await PaymentMethod.getPaymentMethod(req.user.id, paymentMethodId);

    if (!result) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    result.card_number = maskCardNumber(result.card_number);
    res.json({ paymentMethod: result });
  } catch (error) {
    console.error('Error in getPaymentMethod controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Add a new payment method
 */
exports.addPaymentMethod = async (req, res) => {
  try {
    const {
      card_type,
      card_number,
      card_holder_name,
      expiry_month,
      expiry_year,
      is_default,
      billing_address
    } = req.body;

    // Validate required fields
    if (!card_type || !card_number || !card_holder_name || !expiry_month || !expiry_year) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['card_type', 'card_number', 'card_holder_name', 'expiry_month', 'expiry_year']
      });
    }

    // Validate card number
    if (!isValidCardNumber(card_number)) {
      return res.status(400).json({ message: 'Invalid card number format' });
    }

    // Validate expiry date
    if (!isValidExpiryDate(expiry_month, expiry_year)) {
      return res.status(400).json({ message: 'Invalid or expired card date' });
    }

    const paymentData = {
      user_id: req.user.id,
      card_type,
      card_number,
      card_holder_name,
      expiry_month,
      expiry_year,
      is_default: is_default === true,
      billing_address
    };

    const paymentMethodId = await PaymentMethod.create(paymentData);

    res.status(201).json({
      message: 'Payment method added successfully',
      paymentMethodId
    });
  } catch (error) {
    console.error('Error in addPaymentMethod controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Update a payment method
 */
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const {
      card_type,
      card_holder_name,
      expiry_month,
      expiry_year,
      is_default,
      billing_address
    } = req.body;

    const existingMethod = await PaymentMethod.getPaymentMethod(req.user.id, paymentMethodId);
    if (!existingMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Validate expiry date if provided
    if (expiry_month && expiry_year && !isValidExpiryDate(expiry_month, expiry_year)) {
      return res.status(400).json({ message: 'Invalid or expired card date' });
    }

    const paymentData = {
      card_type: card_type || existingMethod.card_type,
      card_holder_name: card_holder_name || existingMethod.card_holder_name,
      expiry_month: expiry_month || existingMethod.expiry_month,
      expiry_year: expiry_year || existingMethod.expiry_year,
      is_default: is_default === undefined ? existingMethod.is_default : is_default,
      billing_address: billing_address || existingMethod.billing_address
    };

    const updated = await PaymentMethod.update(req.user.id, paymentMethodId, paymentData);
    if (!updated) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.json({ message: 'Payment method updated successfully' });
  } catch (error) {
    console.error('Error in updatePaymentMethod controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Delete a payment method
 */
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const deleted = await PaymentMethod.delete(req.user.id, paymentMethodId);

    if (!deleted) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Error in deletePaymentMethod controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Set a payment method as default
 */
exports.setDefaultPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const existingMethod = await PaymentMethod.getPaymentMethod(req.user.id, paymentMethodId);

    if (!existingMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    const updated = await PaymentMethod.setDefault(req.user.id, paymentMethodId);
    if (!updated) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.json({ message: 'Default payment method updated successfully' });
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// ========================
// Helper functions
// ========================

function maskCardNumber(cardNumber) {
  if (!cardNumber) return '';
  const lastFourDigits = cardNumber.slice(-4);
  const maskedPart = cardNumber.slice(0, -4).replace(/[0-9]/g, '*');
  return maskedPart + lastFourDigits;
}

function isValidCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  return /^\d{13,19}$/.test(cleanNumber);
}

function isValidExpiryDate(month, year) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expiryMonth = parseInt(month, 10);
  let expiryYear = parseInt(year, 10);

  if (expiryYear < 100) expiryYear += 2000;
  if (expiryMonth < 1 || expiryMonth > 12) return false;
  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

  return true;
}
