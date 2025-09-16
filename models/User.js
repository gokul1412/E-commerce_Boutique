const db = require('../config/database');

const User = {
  // 🔹 Create a new user
  create: async (userData) => {
    try {
      const { name, email, password, phone, address, city, state, pincode } = userData;
      const [result] = await db.query(
        `INSERT INTO users (name, email, password, phone, address, city, state, pincode)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password, phone, address, city, state, pincode]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // 🔹 Get all users
  findAll: async () => {
    try {
      const [rows] = await db.query(`SELECT * FROM users`);
      return rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // 🔹 Get user by ID
  findById: async (id) => {
    try {
      const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching user by ID (${id}):`, error);
      throw error;
    }
  },

  // 🔹 Get user by Email (Needed for Login)
  findByEmail: async (email) => {
    try {
      const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching user by Email (${email}):`, error);
      throw error;
    }
  },

  // 🔹 Update user
  update: async (id, userData) => {
    try {
      const { name, email, phone, address, city, state, pincode } = userData;
      const [result] = await db.query(
        `UPDATE users 
         SET name=?, email=?, phone=?, address=?, city=?, state=?, pincode=? 
         WHERE id=?`,
        [name, email, phone, address, city, state, pincode, id]
      );
      return result.affectedRows > 0; // Returns true if a row was updated
    } catch (error) {
      console.error(`Error updating user (${id}):`, error);
      throw error;
    }
  },

  // 🔹 Delete user
  delete: async (id) => {
    try {
      const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [id]);
      return result.affectedRows > 0; // Returns true if a row was deleted
    } catch (error) {
      console.error(`Error deleting user (${id}):`, error);
      throw error;
    }
  },
};

module.exports = User;
