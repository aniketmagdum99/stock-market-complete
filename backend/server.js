const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const tradeRoutes = require('./routes/trades');
const adminRoutes = require('./routes/admin');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const seedData = require('./scripts/seed');
const Stock = require('./models/Stock');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (process.env.NODE_ENV === 'development' || !uri) {
      try {
        if (!uri) throw new Error('No URI');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to Local MongoDB');
      } catch (err) {
        console.log('Local MongoDB not found, starting In-Memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log('Connected to In-Memory MongoDB');
      }
    } else {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    }

    // Auto-seed if empty
    const count = await Stock.countDocuments();
    if (count === 0) {
      console.log('Database empty, seeding initial data...');
      await seedData();
    }

    // Ensure admin user exists
    const User = require('./models/User');
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
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

connectDB();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});
