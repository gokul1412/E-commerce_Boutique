const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch (error) {
    return null;
  }
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Generate random string
const generateRandomString = (length = 10) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

// Sanitize input to prevent SQL injection
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input.replace(/['"\\;{}()[\]]/g, '');
};

// Parse JSON safely
const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
};

// Format date
const formatDate = (date, format = 'yyyy-mm-dd') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  if (format === 'yyyy-mm-dd') {
    return `${year}-${month}-${day}`;
  } else if (format === 'dd/mm/yyyy') {
    return `${day}/${month}/${year}`;
  } else {
    return d.toISOString();
  }
};

// Calculate pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  
  return { limit, offset };
};

// Get paging data
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);
  
  return { totalItems, items, totalPages, currentPage };
};

// Sort array of objects by property
const sortByProperty = (array, property, order = 'asc') => {
  return array.sort((a, b) => {
    if (a[property] < b[property]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[property] > b[property]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Filter array of objects by search term
const filterBySearch = (array, searchTerm, properties) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return properties.some(prop => {
      const value = item[prop];
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Validate product data
const validateProductData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Product name is required and should be at least 2 characters long');
  }
  
  if (!data.price || isNaN(data.price) || parseFloat(data.price) <= 0) {
    errors.push('Valid price is required');
  }
  
  if (data.stock_quantity !== undefined && (isNaN(data.stock_quantity) || parseInt(data.stock_quantity) < 0)) {
    errors.push('Stock quantity must be a non-negative number');
  }
  
  return errors;
};

// Validate user data
const validateUserData = (data) => {
  const errors = [];
  
  if (!data.Full_name || data.Full_name.trim().length < 2) {
    errors.push('Full name is required and should be at least 2 characters long');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (data.password && data.password.length < 6) {
    errors.push('Password should be at least 6 characters long');
  }
  
  return errors;
};

// Calculate cart total
const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Generate order confirmation email content
const generateOrderConfirmationEmail = (order, user) => {
  return {
    subject: `Order Confirmation - Order #${order.order_id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
          .order-details { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-details th, .order-details td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .order-details th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Kriya Boutique</h1>
            <h2>Order Confirmation</h2>
          </div>
          <div class="content">
            <p>Dear ${user.Full_name},</p>
            <p>Thank you for your order! We're excited to let you know that we've received your order and it is now being processed.</p>
            
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.order_id}</p>
            <p><strong>Order Date:</strong> ${formatDate(order.order_date)}</p>
            <p><strong>Total Amount:</strong> ${formatCurrency(order.total_amount)}</p>
            
            <h3>Shipping Address</h3>
            <p>${order.shipping_address.replace(/\n/g, '<br>')}</p>
            
            <h3>Order Items</h3>
            <table class="order-details">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
                  <td style="font-weight: bold;">${formatCurrency(order.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
            
            <p>You will receive another email when your order ships.</p>
            <p>If you have any questions, please contact our customer service team.</p>
            
            <p>Thank you for shopping with Kriya Boutique!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kriya Boutique. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  isValidEmail,
  isValidPhone,
  formatCurrency,
  generateRandomString,
  generateOrderNumber,
  sanitizeInput,
  safeJsonParse,
  formatDate,
  getPagination,
  getPagingData,
  sortByProperty,
  filterBySearch,
  debounce,
  throttle,
  validateProductData,
  validateUserData,
  calculateCartTotal,
  generateOrderConfirmationEmail
};