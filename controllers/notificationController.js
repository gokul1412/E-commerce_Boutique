const Notification = require('../models/notification');

// Get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 20; // default 20

    const notifications = await Notification.getUserNotifications(userId, limit);

    res.json({ notifications });
  } catch (error) {
    console.error('Error in getNotifications controller:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { type, message } = req.body;
    if (!type || !message) {
      return res.status(400).json({ message: 'Type and message are required' });
    }

    const notificationId = await Notification.createNotification(req.user.id, message);

    res.status(201).json({
      message: 'Notification created successfully',
      notificationId,
    });
  } catch (error) {
    console.error('Error in createNotification controller:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const result = await Notification.markAsRead(req.user.id, notificationId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error in markAsRead controller:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.markAllAsRead(req.user.id);
    res.json({
      message: 'All notifications marked as read',
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error('Error in markAllAsRead controller:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error in getUnreadCount controller:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const result = await Notification.deleteNotification(req.user.id, notificationId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNotification controller:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};
