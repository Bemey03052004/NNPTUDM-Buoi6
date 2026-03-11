const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');

// Create Role
router.post('/', async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Role by id
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Role
router.put('/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Soft Delete Role
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    role.isDeleted = true;
    await role.save();
    res.json({ message: 'Role soft deleted', role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const User = require('../schemas/users');

// Get all users by role id
router.get('/:id/users', async (req, res) => {
  try {
    const users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
