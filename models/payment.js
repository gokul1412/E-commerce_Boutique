const db = require('../config/database');

const Payment = {
  getUserPaymentMethods: (userId, callback) => {
    const query = 'SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC';
    db.execute(query, [userId], callback);
  },

  addPaymentMethod: (paymentData, callback) => {
    // If setting as default, first remove default from other payment methods
    const setDefaultQuery = `
      UPDATE payment_methods 
      SET is_default = 0 
      WHERE user_id = ? AND is_default = 1
    `;
    
    db.execute(setDefaultQuery, [paymentData.user_id], (err) => {
      if (err) return callback(err);
      
      // Now add the new payment method
      const query = `
        INSERT INTO payment_methods (user_id, type, card_number, expiry_date, is_default) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.execute(
        query, 
        [
          paymentData.user_id, 
          paymentData.type, 
          paymentData.card_number, 
          paymentData.expiry_date, 
          paymentData.is_default || 0
        ], 
        callback
      );
    });
  },

  setDefaultPaymentMethod: (userId, paymentId, callback) => {
    // First remove default from all payment methods
    const removeDefaultQuery = `
      UPDATE payment_methods 
      SET is_default = 0 
      WHERE user_id = ?
    `;
    
    db.execute(removeDefaultQuery, [userId], (err) => {
      if (err) return callback(err);
      
      // Then set the specified payment method as default
      const setDefaultQuery = `
        UPDATE payment_methods 
        SET is_default = 1 
        WHERE id = ? AND user_id = ?
      `;
      
      db.execute(setDefaultQuery, [paymentId, userId], callback);
    });
  },

  deletePaymentMethod: (userId, paymentId, callback) => {
    const query = 'DELETE FROM payment_methods WHERE id = ? AND user_id = ?';
    db.execute(query, [paymentId, userId], callback);
  },

  getDefaultPaymentMethod: (userId, callback) => {
    const query = 'SELECT * FROM payment_methods WHERE user_id = ? AND is_default = 1';
    db.execute(query, [userId], callback);
  }
};

module.exports = Payment;