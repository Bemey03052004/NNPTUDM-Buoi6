
const express = require('express');
const router = express.Router();
const User = require('../schemas/users');

// Create User
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Users (query username includes)
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;
    let filter = { isDeleted: false };
    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }
    const users = await User.find(filter).populate('role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user || user.isDeleted) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user || user.isDeleted) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Soft Delete User
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) return res.status(404).json({ message: 'User not found' });
    user.isDeleted = true;
    await user.save();
    res.json({ message: 'User soft deleted', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enable User
router.post('/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = true;
    await user.save();
    res.json({ message: 'User enabled', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Disable User
router.post('/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = false;
    await user.save();
    res.json({ message: 'User disabled', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
