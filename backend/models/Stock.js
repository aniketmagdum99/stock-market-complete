const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    dailyHigh: { type: Number },
    dailyLow: { type: Number },
    historicalData: [
        {
            date: { type: Date, default: Date.now },
            price: { type: Number }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
