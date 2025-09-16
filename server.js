const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const notificationRoutes = require('./routes/notifications');
const recentlyViewedRoutes = require('./routes/recentlyViewed');
const paymentMethodRoutes = require('./routes/paymentMethods');
const adminRoutes=require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments/methods', paymentMethodRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/admin',adminRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});