const RecentlyViewed = require('../models/recentlyViewed');

/**
 * Get recently viewed products for the authenticated user
 */
exports.getRecentlyViewed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const results = await RecentlyViewed.getUserRecentlyViewed(req.user.id, limit);
    res.json({ recentlyViewed: results });
  } catch (error) {
    console.error('Error in getRecentlyViewed controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Add a product to recently viewed
 */
exports.addRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const result = await RecentlyViewed.addRecentlyViewed(req.user.id, productId);
    res.status(200).json({ 
      message: 'Product added to recently viewed', 
      result 
    });
  } catch (error) {
    console.error('Error in addRecentlyViewed controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Remove a product from recently viewed
 */
exports.removeRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const result = await RecentlyViewed.removeRecentlyViewed(req.user.id, productId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found in recently viewed' });
    }
    
    res.json({ message: 'Product removed from recently viewed' });
  } catch (error) {
    console.error('Error in removeRecentlyViewed controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};

/**
 * Clear all recently viewed products
 */
exports.clearAllRecentlyViewed = async (req, res) => {
  try {
    const result = await RecentlyViewed.clearAllRecentlyViewed(req.user.id);
    res.json({ 
      message: 'All recently viewed products cleared',
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    console.error('Error in clearAllRecentlyViewed controller:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
  }
};