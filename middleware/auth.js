const jwt = require('jsonwebtoken');

// Basic authentication middleware
const auth = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded; // attach user info to request
    next(); // pass control to the next middleware
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Verify token middleware
const verifyToken = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded; // attach user info to request
    next(); // pass control to the next middleware
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Check if user is admin middleware
const isAdmin = function (req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

module.exports = {
  auth,
  verifyToken,
  isAdmin
};
