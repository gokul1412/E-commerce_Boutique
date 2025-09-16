const db = require('../config/database');

const Product = {
  findAll: async () => {
    const query = 'SELECT * FROM products WHERE in_stock = 1';
    const [rows] = await db.execute(query);
    return rows;
  },
  
  findById: async (id) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  },
  
  search: async (term) => {
    const query = 'SELECT * FROM products WHERE name LIKE ? AND in_stock = 1';
    const [rows] = await db.execute(query, [`%${term}%`]);
    return rows;
  },

  create: async (productData) => {
    const query = `
      INSERT INTO products (name, price, image, in_stock)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      productData.name,
      productData.price,
      productData.image,
      productData.in_stock || 1
    ]);
    return result.insertId;
  },

  update: async (id, productData) => {
    const query = `
      UPDATE products 
      SET name = ?, price = ?, image = ?, in_stock = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      productData.name,
      productData.price,
      productData.image,
      productData.in_stock,
      id
    ]);

    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Product;