import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockDetails, clearSelectedStock } from '../store/stockSlice';
import { buyStock, sellStock, resetStatus } from '../store/portfolioSlice';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { ArrowLeft, Bookmark, Share2, Info, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockDetails = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const chartRef = useRef(null);
    const { selectedStock, loading, error } = useSelector((state) => state.stocks);
    const { userInfo } = useSelector((state) => state.auth);
    const { message, error: tradeError } = useSelector((state) => state.portfolio);

    const [quantity, setQuantity] = useState(1);
    const [tradeType, setTradeType] = useState('buy');

    useEffect(() => {
        dispatch(fetchStockDetails(symbol));
        return () => {
            dispatch(clearSelectedStock());
            dispatch(resetStatus());
        };
    }, [dispatch, symbol]);

    const handleTrade = (e) => {
        e.preventDefault();
        const action = tradeType === 'buy' ? buyStock : sellStock;
        dispatch(action({ stockId: selectedStock._id, quantity: parseInt(quantity) }));
    };

    const chartData = {
        labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
        datasets: [{
            label: 'Price',
            data: [
                selectedStock?.currentPrice * 0.985,
                selectedStock?.currentPrice * 0.992,
                selectedStock?.currentPrice * 1.012,
                selectedStock?.currentPrice * 1.008,
                selectedStock?.currentPrice * 1.025,
                selectedStock?.currentPrice * 1.018,
                selectedStock?.currentPrice
            ],
            borderColor: '#00d09c',
            backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return null;
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(0, 208, 156, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 208, 156, 0)');
                return gradient;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: '#00d09c',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#44475b',
                bodyColor: '#44475b',
                borderColor: '#e6e6e8',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                titleFont: { size: 14, family: 'Outfit', weight: 'bold' },
                bodyFont: { size: 14, family: 'Outfit' },
                callbacks: {
                    label: (context) => `₹${context.parsed.y.toFixed(2)}`
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#9ea0ab', font: { family: 'Outfit' } }
            },
            y: {
                grid: { color: 'rgba(230, 230, 232, 0.5)', drawBorder: false },
                ticks: {
                    color: '#9ea0ab',
                    font: { family: 'Outfit' },
                    callback: (value) => `₹${value.toLocaleString()}`
                }
            }
        }
    };

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
                className="d-flex align-items-center justify-content-center fw-bold rounded-circle shadow-sm"
                style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: brand.bg,
                    color: brand.color,
                    fontSize: '1.8rem',
                    border: `2px solid ${brand.color}15`
                }}
            >
                {brand.text}
            </div>
        );
    };

    if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-groww-green"></div></div>;
    if (error || !selectedStock) return <div className="container py-5"><div className="alert alert-danger bg-danger bg-opacity-10 border-0 text-danger">{error || 'Stock not found'}</div></div>;

    return (
        <div className="container pb-5 stagger-container">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <button onClick={() => navigate(-1)} className="btn btn-link text-dim text-decoration-none d-flex align-items-center gap-2 p-0 hover-lift decoration-none fw-bold">
                    <ArrowLeft size={20} /> Markets
                </button>
                <div className="d-flex gap-3">
                    <button className="btn btn-link text-dim p-0 hover-lift"><Bookmark size={20} /></button>
                    <button className="btn btn-link text-dim p-0 hover-lift"><Share2 size={20} /></button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card-minimal mb-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div className="d-flex gap-3 align-items-center">
                                {getStockLogo(selectedStock.symbol)}
                                <div>
                                    <h1 className="fw-bold mb-1" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{selectedStock.name}</h1>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-secondary bg-opacity-10 text-main px-2 py-1 fw-bold">{selectedStock.symbol}</span>
                                        <span className="text-dim small fw-semibold">NSE</span>
                                        <span className="live-dot ms-2"></span>
                                        <span className="text-groww-green small fw-bold">LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <h1 className="fw-extrabold mb-0" style={{ color: 'var(--text-main)' }}>₹{selectedStock.currentPrice.toFixed(2)}</h1>
                                <span className="fw-bold text-groww-green d-flex align-items-center justify-content-end gap-1">
                                    <TrendingUp size={16} /> +42.50 (2.12%)
                                </span>
                            </div>
                        </div>

                        <div style={{ height: '400px' }} className="mb-4">
                            <Line data={chartData} options={chartOptions} ref={chartRef} />
                        </div>

                        <div className="d-flex gap-4 border-bottom pb-3 mb-4 overflow-auto no-scrollbar">
                            <button className="btn btn-link text-groww-green fw-extrabold text-decoration-none p-0 border-bottom border-groww-green border-3 rounded-0 pb-2">Overview</button>
                            <button className="btn btn-link text-dim fw-bold text-decoration-none p-0 pb-2 hover-lift">News</button>
                            <button className="btn btn-link text-dim fw-bold text-decoration-none p-0 pb-2 hover-lift">Events</button>
                            <button className="btn btn-link text-dim fw-bold text-decoration-none p-0 pb-2 hover-lift">Financials</button>
                        </div>

                        <div className="row g-4">
                            <div className="col-12"><h5 className="fw-bold mb-3">Performance</h5></div>
                            <div className="col-6">
                                <div className="text-dim small mb-1 fw-semibold">Today's Low</div>
                                <div className="fw-bold fs-5">₹{(selectedStock.currentPrice * 0.98).toFixed(2)}</div>
                            </div>
                            <div className="col-6 text-end">
                                <div className="text-dim small mb-1 fw-semibold">Today's High</div>
                                <div className="fw-bold fs-5">₹{(selectedStock.currentPrice * 1.02).toFixed(2)}</div>
                            </div>
                            <div className="col-12">
                                <div className="progress overflow-visible" style={{ height: '6px', background: 'var(--bg-secondary)' }}>
                                    <div className="progress-bar bg-groww-green rounded-pill" style={{ width: '65%', position: 'relative' }}>
                                        <div style={{ position: 'absolute', right: '-4px', top: '-4px', width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '3px solid var(--groww-green)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card-minimal sticky-top shadow-lg border-0" style={{ top: '80px' }}>
                        <div className="d-flex bg-secondary bg-opacity-10 rounded-3 p-1 mb-4">
                            <button
                                onClick={() => setTradeType('buy')}
                                className={`btn flex-grow-1 fw-extrabold py-2 rounded-3 border-0 transition-all ${tradeType === 'buy' ? 'bg-white text-groww-green shadow-sm' : 'text-dim'}`}
                            >BUY</button>
                            <button
                                onClick={() => setTradeType('sell')}
                                className={`btn flex-grow-1 fw-extrabold py-2 rounded-3 border-0 transition-all ${tradeType === 'sell' ? 'bg-white text-groww-red shadow-sm' : 'text-dim'}`}
                            >SELL</button>
                        </div>

                        {message && <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success fw-bold small mb-4">{message}</div>}
                        {tradeError && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger fw-bold small mb-4">{tradeError}</div>}

                        <form onSubmit={handleTrade}>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <label className="text-dim small fw-bold">Quantity (Shares)</label>
                                    <span className="text-groww-green small fw-bold d-flex align-items-center gap-1">
                                        <Info size={14} /> Market Price
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control border-light bg-light py-3 fw-bold fs-4 text-center rounded-3 focus-none"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>

                            <div className="d-flex justify-content-between mb-4 p-3 bg-secondary bg-opacity-10 rounded-3">
                                <div className="d-flex align-items-center gap-2">
                                    <Wallet size={16} className="text-dim" />
                                    <span className="text-dim small fw-bold">Buying Power</span>
                                </div>
                                <span className="fw-bold">₹{userInfo?.balance?.toLocaleString()}</span>
                            </div>

                            <div className="border-top pt-4">
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-dim small fw-bold">Total Est.</span>
                                    <h4 className="fw-extrabold mb-0 fs-3">₹{(quantity * selectedStock.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                                </div>
                                <button type="submit" className={`btn w-100 py-3 rounded-3 fw-extrabold fs-5 transition-all shadow ${tradeType === 'buy' ? 'btn-groww' : 'bg-groww-red text-white'}`} style={tradeType === 'sell' ? { background: 'var(--groww-red)' } : {}}>
                                    {tradeType.toUpperCase()} {selectedStock.symbol}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .focus-none:focus { box-shadow: none; border-color: var(--border-light); }
            ` }} />
        </div>
    );
};

export default StockDetails;
