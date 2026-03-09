const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const mongoose = require('mongoose');

// Buy Stock
router.post('/buy', protect, async (req, res) => {
    const { stockId, quantity } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const stock = await Stock.findById(stockId).session(session);
        if (!stock) throw new Error('Stock not found');

        const totalCost = stock.currentPrice * quantity;
        const user = await User.findById(req.user._id).session(session);

        if (user.balance < totalCost) throw new Error('Insufficient balance');

        // Update user balance
        user.balance -= totalCost;
        await user.save({ session });

        // Create transaction
        await Transaction.create([{
            userId: user._id,
            stockId: stock._id,
            type: 'buy',
            quantity,
            price: stock.currentPrice,
            totalAmount: totalCost
        }], { session });

        // Update Portfolio
        let portfolioEntry = await Portfolio.findOne({ userId: user._id, stockId: stock._id }).session(session);
        if (portfolioEntry) {
            const newTotalQty = portfolioEntry.quantity + quantity;
            const newAvgPrice = ((portfolioEntry.averagePrice * portfolioEntry.quantity) + totalCost) / newTotalQty;
            portfolioEntry.quantity = newTotalQty;
            portfolioEntry.averagePrice = newAvgPrice;
            await portfolioEntry.save({ session });
        } else {
            await Portfolio.create([{
                userId: user._id,
                stockId: stock._id,
                quantity,
                averagePrice: stock.currentPrice
            }], { session });
        }

        await session.commitTransaction();
        res.json({ message: 'Purchase successful', balance: user.balance });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

// Sell Stock
router.post('/sell', protect, async (req, res) => {
    const { stockId, quantity } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const stock = await Stock.findById(stockId).session(session);
        const portfolioEntry = await Portfolio.findOne({ userId: req.user._id, stockId }).session(session);

        if (!portfolioEntry || portfolioEntry.quantity < quantity) {
            throw new Error('Insufficient shares in portfolio');
        }

        const totalCredit = stock.currentPrice * quantity;
        const user = await User.findById(req.user._id).session(session);

        // Update balance
        user.balance += totalCredit;
        await user.save({ session });

        // Create transaction
        await Transaction.create([{
            userId: user._id,
            stockId: stock._id,
            type: 'sell',
            quantity,
            price: stock.currentPrice,
            totalAmount: totalCredit
        }], { session });

        // Update Portfolio
        portfolioEntry.quantity -= quantity;
        if (portfolioEntry.quantity === 0) {
            await Portfolio.deleteOne({ _id: portfolioEntry._id }).session(session);
        } else {
            await portfolioEntry.save({ session });
        }

        await session.commitTransaction();
        res.json({ message: 'Sale successful', balance: user.balance });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

// Get User Portfolio
router.get('/portfolio', protect, async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ userId: req.user._id }).populate('stockId');
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
