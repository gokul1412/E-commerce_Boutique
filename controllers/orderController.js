const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// =====================
// Create a new order
// =====================
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderData = {
      user_id: req.user.id,
      total: req.body.total,
      items: req.body.items
    };

    const orderId = await Order.create(orderData);
    await Order.addItems(orderId, orderData.items);

    return res.status(201).json({
      message: 'Order created successfully',
      orderId
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// =====================
// Get all orders for a user
// =====================
exports.getUserOrders = async (req, res) => {
  try {
    const results = await Order.findByUserId(req.user.id);

    const orders = results.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    return res.json({ orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// =====================
// Get single order by ID
// =====================
exports.getOrder = async (req, res) => {
  try {
    const results = await Order.findById(req.params.id);
    if (!results.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = {
      ...results[0],
      items: typeof results[0].items === 'string' ? JSON.parse(results[0].items) : results[0].items
    };

    // Ensure user owns the order
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json({ order });
  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// =====================
// Update order status (Admin only)
// =====================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await Order.updateStatus(req.params.id, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};
