const db = require('../config/database');

const PaymentMethod = {
  /**
   * Get payment methods for a user
   * @param {number} userId - The user ID
   * @returns {Promise<Array>} - Array of payment methods
   */
  getUserPaymentMethods: async (userId) => {
    try {
      const query = `
        SELECT * FROM payment_methods
        WHERE user_id = ?
        ORDER BY is_default DESC, created_at DESC
      `;
      const [results] = await db.execute(query, [userId]);
      return results;
    } catch (error) {
      console.error('Error in PaymentMethod.getUserPaymentMethods:', error);
      throw error;
    }
  },

  /**
   * Get a specific payment method
   * @param {number} userId - The user ID
   * @param {number} paymentMethodId - The payment method ID
   * @returns {Promise<Object>} - Payment method object
   */
  getPaymentMethod: async (userId, paymentMethodId) => {
    try {
      const query = `
        SELECT * FROM payment_methods
        WHERE id = ? AND user_id = ?
      `;
      const [results] = await db.execute(query, [paymentMethodId, userId]);
      return results[0] || null;
    } catch (error) {
      console.error('Error in PaymentMethod.getPaymentMethod:', error);
      throw error;
    }
  },

  /**
   * Add a new payment method
   * @param {Object} paymentData - Payment method data
   * @returns {Promise<number>} - The new payment method ID
   */
  create: async (paymentData) => {
    try {
      // If this is the first payment method or is_default is true, set as default
      if (paymentData.is_default) {
        await PaymentMethod.resetDefaultPaymentMethods(paymentData.user_id);
      } else {
        const existingMethods = await PaymentMethod.getUserPaymentMethods(paymentData.user_id);
        if (existingMethods.length === 0) {
          paymentData.is_default = true;
        }
      }

      const query = `
        INSERT INTO payment_methods (
          user_id, card_type, card_number, card_holder_name, 
          expiry_month, expiry_year, is_default, billing_address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute(query, [
        paymentData.user_id,
        paymentData.card_type,
        paymentData.card_number,
        paymentData.card_holder_name,
        paymentData.expiry_month,
        paymentData.expiry_year,
        paymentData.is_default ? 1 : 0,
        paymentData.billing_address || null
      ]);

      return result.insertId;
    } catch (error) {
      console.error('Error in PaymentMethod.create:', error);
      throw error;
    }
  },

  /**
   * Update a payment method
   * @param {number} userId - The user ID
   * @param {number} paymentMethodId - The payment method ID
   * @param {Object} paymentData - Updated payment method data
   * @returns {Promise<boolean>} - True if successful
   */
  update: async (userId, paymentMethodId, paymentData) => {
    try {
      if (paymentData.is_default) {
        await PaymentMethod.resetDefaultPaymentMethods(userId);
      }

      const query = `
        UPDATE payment_methods
        SET 
          card_type = ?,
          card_holder_name = ?,
          expiry_month = ?,
          expiry_year = ?,
          is_default = ?,
          billing_address = ?
        WHERE id = ? AND user_id = ?
      `;

      const [result] = await db.execute(query, [
        paymentData.card_type,
        paymentData.card_holder_name,
        paymentData.expiry_month,
        paymentData.expiry_year,
        paymentData.is_default ? 1 : 0,
        paymentData.billing_address || null,
        paymentMethodId,
        userId
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in PaymentMethod.update:', error);
      throw error;
    }
  },

  /**
   * Delete a payment method
   * @param {number} userId - The user ID
   * @param {number} paymentMethodId - The payment method ID
   * @returns {Promise<boolean>} - True if successful
   */
  delete: async (userId, paymentMethodId) => {
    try {
      const paymentMethod = await PaymentMethod.getPaymentMethod(userId, paymentMethodId);

      const query = `
        DELETE FROM payment_methods
        WHERE id = ? AND user_id = ?
      `;
      const [result] = await db.execute(query, [paymentMethodId, userId]);

      if (paymentMethod && paymentMethod.is_default) {
        const remainingMethods = await PaymentMethod.getUserPaymentMethods(userId);
        if (remainingMethods.length > 0) {
          await PaymentMethod.setDefault(userId, remainingMethods[0].id);
        }
      }

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in PaymentMethod.delete:', error);
      throw error;
    }
  },

  /**
   * Set a payment method as default
   * @param {number} userId - The user ID
   * @param {number} paymentMethodId - The payment method ID
   * @returns {Promise<boolean>} - True if successful
   */
  setDefault: async (userId, paymentMethodId) => {
    try {
      await PaymentMethod.resetDefaultPaymentMethods(userId);

      const query = `
        UPDATE payment_methods
        SET is_default = 1
        WHERE id = ? AND user_id = ?
      `;
      const [result] = await db.execute(query, [paymentMethodId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in PaymentMethod.setDefault:', error);
      throw error;
    }
  },

  /**
   * Reset all payment methods to non-default for a user
   * @param {number} userId - The user ID
   * @returns {Promise<Object>} - Result of the operation
   */
  resetDefaultPaymentMethods: async (userId) => {
    try {
      const query = `
        UPDATE payment_methods
        SET is_default = 0
        WHERE user_id = ?
      `;
      const [result] = await db.execute(query, [userId]);
      return result;
    } catch (error) {
      console.error('Error in PaymentMethod.resetDefaultPaymentMethods:', error);
      throw error;
    }
  }
};

module.exports = PaymentMethod;
