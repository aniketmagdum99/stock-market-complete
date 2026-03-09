import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks } from '../store/stockSlice';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight, PieChart, Wallet, Activity, ExternalLink, Clock } from 'lucide-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stocks, loading, error } = useSelector((state) => state.stocks);
    const { userInfo } = useSelector((state) => state.auth);

    // Live Index Simulation
    const [indices, setIndices] = useState({
        nifty: { value: 21853.80, change: 1.24, isUp: true },
        sensex: { value: 72101.60, change: 0.98, isUp: true },
        niftyBank: { value: 45690.80, change: -0.45, isUp: false }
    });

    // Mock Market News
    const [news] = useState([
        { id: 1, title: "Nifty 50 approaches record high as IT stocks surge", source: "Mint", time: "10m ago", category: "Market" },
        { id: 2, title: "Reliance Industries to announce Q3 results today", source: "ET Now", time: "25m ago", category: "Stocks" },
        { id: 3, title: "Global markets stable ahead of US Fed meeting", source: "Bloomberg", time: "45m ago", category: "Global" },
        { id: 4, title: "Zomato shares jump 5% on positive growth outlook", source: "Reuters", time: "1h ago", category: "Fintech" },
        { id: 5, title: "IPO Alert: Nova Agro to list with 20% premium", source: "MoneyControl", time: "2h ago", category: "IPO" }
    ]);

    useEffect(() => {
        dispatch(fetchStocks());

        const interval = setInterval(() => {
            setIndices(prev => {
                const update = (obj) => {
                    const fluctuation = (Math.random() - 0.5) * 5;
                    const newValue = obj.value + fluctuation;
                    return {
                        ...obj,
                        value: newValue,
                        change: obj.change + (fluctuation / obj.value) * 100
                    };
                };
                return {
                    nifty: update(prev.nifty),
                    sensex: update(prev.sensex),
                    niftyBank: update(prev.niftyBank)
                };
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [dispatch]);

    const getStockLogo = (symbol) => {
        const brands = {
            'AAPL': { color: '#000000', bg: '#f5f5f7', text: '' },
            'GOOGL': { color: '#4285F4', bg: 'rgba(66, 133, 244, 0.1)', text: 'G' },
            'MSFT': { color: '#00A4EF', bg: 'rgba(0, 164, 239, 0.1)', text: 'M' },
            'TSLA': { color: '#E81010', bg: 'rgba(232, 16, 16, 0.05)', text: 'T' },
            'AMZN': { color: '#FF9900', bg: 'rgba(255, 153, 0, 0.1)', text: 'A' },
            'NVDA': { color: '#76B900', bg: 'rgba(118, 185, 0, 0.1)', text: 'N' },
            'META': { color: '#0668E1', bg: 'rgba(6, 104, 225, 0.1)', text: 'M' },
            'NFLX': { color: '#E50914', bg: 'rgba(229, 9, 20, 0.05)', text: 'N' }
        };
        const brand = brands[symbol.toUpperCase()] || { color: '#44475b', bg: 'rgba(0,0,0,0.05)', text: symbol[0] };
        return (
            <div
                className="d-flex align-items-center justify-content-center fw-bold rounded-circle shadow-sm transition-all"
                style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: brand.bg,
                    color: brand.color,
                    fontSize: '1.2rem',
                    border: `1px solid ${brand.color}15`
                }}
            >
                {brand.text}
            </div>
        );
    };

    return (
        <div className="container pb-5 stagger-container">
            <header className="mb-5 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Market <span className="text-groww-green">Dashboard</span></h1>
                    <div className="d-flex align-items-center gap-2">
                        <span className="live-dot"></span>
                        <p className="text-dim mb-0 small fw-bold">LIVE MARKET</p>
                    </div>
                </div>
                <div className="text-end d-none d-md-block">
                    <div className="card-minimal border-0 bg-secondary bg-opacity-10 py-2 px-4 rounded-3 d-flex align-items-center gap-3">
                        <div>
                            <p className="text-dim small mb-0 fw-semibold">Available Cash</p>
                            <h4 className="fw-bold mb-0" style={{ color: '#44475b' }}>₹{userInfo?.balance?.toLocaleString()}</h4>
                        </div>
                        <Link to="/portfolio" className="btn btn-groww btn-sm py-1 px-3 shadow-none">Top Up</Link>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-groww-green" role="status"></div>
                </div>
            ) : error ? (
                <div className="alert alert-danger card-minimal border-0 text-danger bg-danger bg-opacity-10">{error}</div>
            ) : (
                <div className="row g-4">
                    {/* Market Summary Widgets */}
                    <div className="col-12 mb-2">
                        <div className="d-flex gap-3 overflow-auto pb-2 no-scrollbar">
                            <div className="card-minimal flex-shrink-0 transition-all hover-lift" style={{ minWidth: '240px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-dim small fw-bold">NIFTY 50</span>
                                    <span className={`small fw-bold ${indices.nifty.change >= 0 ? 'text-groww-green' : 'text-groww-red'}`}>
                                        {indices.nifty.change >= 0 ? '+' : ''}{indices.nifty.change.toFixed(2)}%
                                    </span>
                                </div>
                                <h4 className="fw-extrabold mb-0">₹{indices.nifty.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                            </div>
                            <div className="card-minimal flex-shrink-0 transition-all hover-lift" style={{ minWidth: '240px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-dim small fw-bold">SENSEX</span>
                                    <span className={`small fw-bold ${indices.sensex.change >= 0 ? 'text-groww-green' : 'text-groww-red'}`}>
                                        {indices.sensex.change >= 0 ? '+' : ''}{indices.sensex.change.toFixed(2)}%
                                    </span>
                                </div>
                                <h4 className="fw-extrabold mb-0">₹{indices.sensex.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                            </div>
                            <div className="card-minimal flex-shrink-0 transition-all hover-lift" style={{ minWidth: '240px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-dim small fw-bold">NIFTY BANK</span>
                                    <span className={`small fw-bold ${indices.niftyBank.change >= 0 ? 'text-groww-green' : 'text-groww-red'}`}>
                                        {indices.niftyBank.change >= 0 ? '+' : ''}{indices.niftyBank.change.toFixed(2)}%
                                    </span>
                                </div>
                                <h4 className="fw-extrabold mb-0">₹{indices.niftyBank.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 mt-4">
                        <h4 className="fw-bold mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Stocks for you</h4>
                        <div className="row g-4 stagger-container">
                            {stocks.map((stock) => {
                                const isUp = true; // Simulated
                                return (
                                    <div key={stock._id} className="col-md-6 col-lg-6 col-xl-4">
                                        <Link to={`/stock/${stock.symbol.toLowerCase()}`} className="text-decoration-none">
                                            <div className="stock-card-lite h-100 hover-lift">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    {getStockLogo(stock.symbol)}
                                                    <div className="text-end">
                                                        <h5 className="fw-extrabold mb-0" style={{ color: '#44475b' }}>₹{stock.currentPrice.toFixed(2)}</h5>
                                                        <span className={`small fw-bold ${isUp ? 'text-groww-green' : 'text-groww-red'}`}>
                                                            {isUp ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-main">{stock.symbol}</h6>
                                                    <p className="text-dim small mb-0 text-truncate">{stock.name}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="col-lg-4 mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0" style={{ color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Market News</h4>
                            <span className="badge bg-groww-green bg-opacity-10 text-groww-green border-0 rounded-pill px-3 py-2 fw-bold small">Today</span>
                        </div>
                        <div className="stagger-container">
                            {news.map((item) => (
                                <div key={item.id} className="card-minimal mb-3 p-3 hover-lift border-0 shadow-sm transition-all" style={{ background: '#fff' }}>
                                    <div className="d-flex gap-3">
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-dim extra-small fw-extrabold text-uppercase letter-spacing-1">{item.category}</span>
                                                <div className="d-flex align-items-center gap-1 text-dim extra-small fw-bold">
                                                    <Clock size={12} /> {item.time}
                                                </div>
                                            </div>
                                            <h6 className="fw-bold text-main line-clamp-2 mb-2" style={{ lineHeight: '1.4' }}>{item.title}</h6>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <span className="text-dim small fw-bold">{item.source}</span>
                                                <ExternalLink size={14} className="text-dim hover-green cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-link text-groww-green w-100 text-decoration-none fw-bold mt-2 hover-bg-light rounded-3 py-2">
                            View All News <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .extra-small { font-size: 0.7rem; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .hover-green:hover { color: var(--groww-green) !important; }
            ` }} />
        </div>
    );
};

export default Dashboard;
