const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

// Register
exports.register = async (req, res) => {
  const { Full_name, email, password, phone } = req.body;

  if (!phone || !password) return res.status(400).json({ message: 'Phone and password required' });

  try {
    const [rows] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (Full_name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
      [Full_name, email, hashed, phone || null]
    );

    const token = generateToken(result.insertId);
    res.status(201).json({ token, user: { id: result.insertId, Full_name, email, phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.user_id);
    res.json({ token, user: { id: user.user_id, Full_name: user.Full_name, email: user.email, phone: user.phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, Full_name, email, phone FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  const { Full_name, email, phone } = req.body;

  try {
    await pool.query(
      'UPDATE users SET Full_name = COALESCE(?, Full_name), email = COALESCE(?, email), phone = COALESCE(?, phone) WHERE user_id = ?',
      [Full_name, email, phone, req.user.user_id]
    );

    const [rows] = await pool.query('SELECT user_id, Full_name, email, phone FROM users WHERE user_id = ?', [req.user.user_id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
