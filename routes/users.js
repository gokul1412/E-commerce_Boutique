const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Use the correct function names
router.post('/register', userController.createUser);  // ✅ was registerUser
router.post('/login', userController.loginUser);      // ✅ loginUser is correct

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
