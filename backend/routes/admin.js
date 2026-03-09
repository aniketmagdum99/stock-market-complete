const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all transactions (Admin only)
router.get('/transactions', protect, admin, async (req, res) => {
    try {
        const transactions = await Transaction.find({}).populate('userId', 'name email').populate('stockId', 'symbol name');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new stock (Admin only)
router.post('/stocks', protect, admin, async (req, res) => {
    const { symbol, name, currentPrice } = req.body;
    try {
        const stock = await Stock.create({ symbol: symbol.toUpperCase(), name, currentPrice });
        res.status(201).json(stock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update stock (Admin only)
router.put('/stocks/:id', protect, admin, async (req, res) => {
    try {
        const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(stock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete stock (Admin only)
router.delete('/stocks/:id', protect, admin, async (req, res) => {
    try {
        await Stock.findByIdAndDelete(req.params.id);
        res.json({ message: 'Stock deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user role (Admin only)
router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent admin from demoting themselves
        if (req.user._id.toString() === user._id.toString() && req.body.role === 'user') {
            return res.status(400).json({ message: 'Cannot demote your own admin account' });
        }

        user.role = req.body.role || user.role;
        await user.save();
        res.json({ message: 'User role updated', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own admin account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
