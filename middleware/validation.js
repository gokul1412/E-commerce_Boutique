// Simplified validation middleware without express-validator
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2 || name.trim().length > 150) {
    errors.push('Name is required and must be between 2 and 150 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length > 255) {
    errors.push('Please provide a valid email address (max 255 characters)');
  }

  // Password validation
  if (!password || password.length < 6 || password.length > 255) {
    errors.push('Password must be at least 6 characters long (max 255 characters)');
  }

  // Phone validation (optional)
  if (req.body.phone && req.body.phone.length > 50) {
    errors.push('Phone must be less than 50 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length === 0 || name.length > 255) {
    errors.push('Product name is required and must be less than 255 characters');
  }

  // Price validation
  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    errors.push('Price must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { total, items } = req.body;
  const errors = [];

  // Total validation
  if (!total || isNaN(total) || parseFloat(total) <= 0) {
    errors.push('Order total must be a positive number');
  }

  // Items validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must have at least one item');
  } else {
    items.forEach((item, index) => {
      if (!item.product_id || isNaN(item.product_id) || parseInt(item.product_id) <= 0) {
        errors.push(`Item ${index + 1}: Product ID must be a positive integer`);
      }
      if (!item.qty || isNaN(item.qty) || parseInt(item.qty) <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be at least 1`);
      }
      if (!item.price || isNaN(item.price) || parseFloat(item.price) <= 0) {
        errors.push(`Item ${index + 1}: Price must be a positive number`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProduct,
  validateOrder
};