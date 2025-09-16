const db = require('../config/database');

const RecentlyViewed = {
  // Get recently viewed products for a user
  getUserRecentlyViewed: async (userId, limit = 10) => {
    try {
      const numericUserId = parseInt(userId, 10);
      const numericLimit = parseInt(limit, 10);

      if (isNaN(numericUserId) || isNaN(numericLimit)) {
        throw new Error('Invalid userId or limit');
      }

      const [rows] = await db.query(
        `SELECT rv.id, rv.user_id, rv.product_id, rv.viewed_at, 
                p.name, p.price, p.image
         FROM recently_viewed rv
         JOIN products p ON rv.product_id = p.id
         WHERE rv.user_id = ?
         ORDER BY rv.viewed_at DESC
         LIMIT ?`,
        [numericUserId, numericLimit] // ✅ pass both parameters as numbers
      );

      return rows;
    } catch (error) {
      console.error('Error fetching recently viewed products:', error);
      throw error;
    }
  },

  // Add a product to recently viewed
  addRecentlyViewed: async (userId, productId) => {
    try {
      const numericUserId = parseInt(userId, 10);
      const numericProductId = parseInt(productId, 10);

      if (isNaN(numericUserId) || isNaN(numericProductId)) {
        throw new Error('Invalid userId or productId');
      }

      const [result] = await db.query(
        `INSERT INTO recently_viewed (user_id, product_id, viewed_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE viewed_at = NOW()`,
        [numericUserId, numericProductId]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error adding recently viewed product:', error);
      throw error;
    }
  }
};

module.exports = RecentlyViewed;
