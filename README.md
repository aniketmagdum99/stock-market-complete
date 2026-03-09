# Full-Stack Stock Trading Web App (MERN)

A production-ready stock trading application built with MongoDB, Express.js, React, and Node.js.

## Features
- **User Authentication**: JWT-based login/register with role-based access.
- **Real-time Trading**: Buy and sell stocks with atomic balance updates.
- **Portfolio Management**: Track investment value, profit/loss, and holdings.
- **Market Dashboard**: Browse stocks with individual detail pages and price charts.
- **Admin Panel**: Manage users and view all market transactions.
- **Premium UI**: Dark-themed, responsive design with glassmorphism aesthetics.

## Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, Axios, Chart.js, Bootstrap 5, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose, JWT, Bcrypt.
- **Database**: MongoDB.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Installation

1. **Install Root Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` folder (example provided in the project).*

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Seed Database (Required for initial stocks):**
   ```bash
   npm run seed
   ```

5. **Run the Application:**
   From the root directory:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/stocks` - Fetch all stocks
- `POST /api/trades/buy` - Execute buy order
- `POST /api/trades/sell` - Execute sell order
- `GET /api/trades/portfolio` - Fetch user holdings
- `GET /api/admin/users` - Admin: List users
