const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stock = require('../models/Stock');
const User = require('../models/User');

dotenv.config();

const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 185.20, dailyHigh: 187.00, dailyLow: 184.50 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 142.50, dailyHigh: 145.00, dailyLow: 141.20 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 405.10, dailyHigh: 410.00, dailyLow: 402.30 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 175.00, dailyHigh: 178.50, dailyLow: 174.00 },
    { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 202.30, dailyHigh: 205.00, dailyLow: 198.80 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 720.50, dailyHigh: 730.00, dailyLow: 715.00 },
    { symbol: 'META', name: 'Meta Platforms Inc.', currentPrice: 485.40, dailyHigh: 490.00, dailyLow: 480.20 },
    { symbol: 'NFLX', name: 'Netflix Inc.', currentPrice: 590.20, dailyHigh: 600.00, dailyLow: 585.00 },
];

const seedData = async () => {
    try {
        await Stock.deleteMany({});
        console.log('Cleared existing stocks');

        await Stock.insertMany(stocks);
        console.log('Seed stocks added successfully');

        // Create admin user if not exists
        const adminExists = await User.findOne({ email: 'admin@stocktrade.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@stocktrade.com',
                password: 'admin123',
                role: 'admin',
                balance: 100000
            });
            console.log('Admin user created: admin@stocktrade.com / admin123');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

module.exports = seedData;

if (require.main === module) {
    dotenv.config();
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            return seedData();
        })
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Error during seeding process:', error);
            process.exit(1);
        });
}
