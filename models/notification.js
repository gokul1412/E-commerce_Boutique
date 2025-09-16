const db = require('../config/database');

const Notification = {
  // Get notifications for a user with optional limit
  getUserNotifications: async (userId, limit = 10) => {
    try {
      // Ensure userId and limit are numbers
      const numericUserId = parseInt(userId, 10);
      const numericLimit = parseInt(limit, 10);

      if (isNaN(numericUserId) || isNaN(numericLimit)) {
        throw new Error('Invalid userId or limit');
      }

      const [rows] = await db.query(
        `SELECT * FROM notifications
         WHERE user_id = ?
         ORDER BY date DESC
         LIMIT ?`,
        [numericUserId, numericLimit]
      );

      return rows;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Optionally: Add other notification model methods here
  createNotification: async (userId, message) => {
    try {
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) throw new Error('Invalid userId');

      const [result] = await db.query(
        `INSERT INTO notifications (user_id, message, date) VALUES (?, ?, NOW())`,
        [numericUserId, message]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
};

module.exports = Notification;
