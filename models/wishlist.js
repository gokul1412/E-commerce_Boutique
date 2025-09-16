const db = require('../config/database');

const Wishlist = {
  getUserWishlist: async (userId) => {
    try {
      const query = `
        SELECT w.*, p.name, p.price, p.image, p.in_stock 
        FROM wishlist w 
        JOIN products p ON w.product_id = p.id 
        WHERE w.user_id = ? 
        ORDER BY w.created_at DESC
      `;
      const [rows] = await db.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error('Error in Wishlist.getUserWishlist:', error);
      throw error;
    }
  },

  addToWishlist: async (userId, productId) => {
    try {
      // First check if the product is already in the wishlist
      const checkQuery = 'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?';
      const [results] = await db.execute(checkQuery, [userId, productId]);
      
      if (results.length > 0) {
        return { message: 'Product already in wishlist' };
      }

      // If not, add to wishlist
      const insertQuery = 'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)';
      const [result] = await db.execute(insertQuery, [userId, productId]);
      return result;
    } catch (error) {
      console.error('Error in Wishlist.addToWishlist:', error);
      throw error;
    }
  },

  removeFromWishlist: async (userId, productId) => {
    try {
      const query = 'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?';
      const [result] = await db.execute(query, [userId, productId]);
      return result;
    } catch (error) {
      console.error('Error in Wishlist.removeFromWishlist:', error);
      throw error;
    }
  },

  isInWishlist: async (userId, productId) => {
    try {
      const query = 'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?';
      const [results] = await db.execute(query, [userId, productId]);
      return results.length > 0;
    } catch (error) {
      console.error('Error in Wishlist.isInWishlist:', error);
      throw error;
    }
  }
};

module.exports = Wishlist;