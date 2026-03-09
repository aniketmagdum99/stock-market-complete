import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StockDetails from './pages/StockDetails';
import Portfolio from './pages/Portfolio';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Navbar />
            <main className="min-vh-100">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/stock/:symbol" element={<StockDetails />} />
                    </Route>

                    <Route element={<ProtectedRoute adminOnly={true} />}>
                        <Route path="/admin" element={<AdminPanel />} />
                    </Route>
                </Routes>
            </main>
            <footer className="py-4 text-center border-top border-secondary mt-5">
                <p className="text-gray small">&copy; 2024 StockTrade. For educational purposes only.</p>
            </footer>
        </Router>
    );
}

export default App;
