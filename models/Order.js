// models/Order.js
const db = require('../config/database');

const Order = {
  // Create a new order
  create: async (orderData) => {
    const { user_id, total } = orderData;
    const [result] = await db.execute(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [user_id, total]
    );
    return result.insertId; // Return the new order ID
  },

  // Add multiple items to an order
  addItems: async (orderId, items) => {
    if (!items || items.length === 0) return;

    const values = [];
    const placeholders = [];

    items.forEach(item => {
      values.push(orderId, item.product_id, item.qty, item.price);
      placeholders.push('(?, ?, ?, ?)');
    });

    const query = `INSERT INTO order_items (order_id, product_id, qty, price) VALUES ${placeholders.join(',')}`;
    await db.execute(query, values);
  },

  // Get all orders for a specific user
  findByUserId: async (userId) => {
    const query = `
      SELECT o.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'qty', oi.qty,
            'price', oi.price,
            'name', p.name,
            'image', p.image
          )
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.createdAt DESC
    `;
    const [results] = await db.execute(query, [userId]);
    return results;
  },

  // Get a single order by ID
  findById: async (id) => {
    const query = `
      SELECT o.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'qty', oi.qty,
            'price', oi.price,
            'name', p.name,
            'image', p.image
          )
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id
    `;
    const [results] = await db.execute(query, [id]);
    return results;
  },

  // Update the status of an order
  updateStatus: async (id, status) => {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, id]);
    return result;
  },

  // Optional: Get orders filtered by status (admin dashboard)
  getOrdersByStatus: async (status) => {
    const query = `
      SELECT o.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'qty', oi.qty,
            'price', oi.price,
            'name', p.name,
            'image', p.image
          )
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.status = ?
      GROUP BY o.id
      ORDER BY o.createdAt DESC
    `;
    const [results] = await db.execute(query, [status]);
    return results;
  }
};

module.exports = Order;
