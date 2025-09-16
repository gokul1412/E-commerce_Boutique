const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/auth'); // Destructure auth from the exported object

router.use(auth); // Use the auth middleware

router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.patch('/:notificationId/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.get('/unread-count', notificationController.getUnreadCount);
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
