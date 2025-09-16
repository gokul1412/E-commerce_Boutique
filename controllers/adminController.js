const db = require('../config/database');

// Get Admin Dashboard Data
const getDashboard = async (req, res) => {
  try {
    // Example data – customize as needed
    const [userCount] = await db.execute('SELECT COUNT(*) as totalUsers FROM users');
    res.json({
      message: 'Admin Dashboard Data',
      totalUsers: userCount[0].totalUsers
    });
  } catch (error) {
    console.error('Error in getDashboard:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT user_id, name, email, role, created_at FROM users');
    res.json({ users });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Delete a User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM users WHERE user_id = ?', [id]);
    res.json({ message: `User with ID ${id} deleted successfully` });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  deleteUser
};
