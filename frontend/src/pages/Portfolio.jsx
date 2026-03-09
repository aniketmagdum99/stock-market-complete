import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio } from '../store/portfolioSlice';
import { Briefcase, Wallet, TrendingUp, TrendingDown, DollarSign, Info } from 'lucide-react';

const Portfolio = () => {
    const dispatch = useDispatch();
    const { holdings, loading, error } = useSelector((state) => state.portfolio);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchPortfolio());
    }, [dispatch]);

    const totalInvestment = holdings.reduce((sum, item) => sum + (item.quantity * item.averagePrice), 0);
    const currentTotalValue = holdings.reduce((sum, item) => sum + (item.quantity * (item.stockId?.currentPrice || 0)), 0);
    const totalPL = currentTotalValue - totalInvestment;
    const plPercentage = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

    return (
        <div className="container pb-5">
            <header className="mb-5">
                <h1 className="fw-bold mb-1" style={{ color: '#44475b' }}>Your <span className="text-groww-green">Portfolio</span></h1>
                <p className="text-dim">Track your investments and performance in real-time</p>
            </header>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card-minimal border-0 bg-secondary bg-opacity-10 p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-2 rounded-3 bg-white text-groww-green shadow-sm">
                                <DollarSign size={24} />
                            </div>
                            <span className="text-dim small fw-bold uppercase tracking-wider">Total Invested</span>
                        </div>
                        <h2 className="fw-extrabold mb-0" style={{ color: '#44475b' }}>₹{totalInvestment.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-minimal border-2 border-groww-green p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-2 rounded-3 bg-groww-green text-white shadow-sm">
                                <Briefcase size={24} />
                            </div>
                            <span className="text-dim small fw-bold uppercase tracking-wider">Current Value</span>
                        </div>
                        <h2 className="fw-extrabold mb-0" style={{ color: '#44475b' }}>₹{currentTotalValue.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-minimal border-0 bg-secondary bg-opacity-10 p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className={`p-2 rounded-3 text-white shadow-sm ${totalPL >= 0 ? 'bg-groww-green' : 'bg-groww-red'}`}>
                                {totalPL >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                            </div>
                            <span className="text-dim small fw-bold uppercase tracking-wider">Total P/L</span>
                        </div>
                        <div className="d-flex align-items-baseline gap-2">
                            <h2 className={`fw-extrabold mb-0 ${totalPL >= 0 ? 'text-groww-green' : 'text-groww-red'}`}>
                                {totalPL >= 0 ? '+' : ''}₹{Math.abs(totalPL).toLocaleString()}
                            </h2>
                            <span className={`fw-bold ${totalPL >= 0 ? 'text-groww-green' : 'text-groww-red'}`}>
                                ({totalPL >= 0 ? '+' : ''}{plPercentage.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-minimal p-0 border-0 shadow-sm overflow-hidden rounded-4">
                <div className="bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0" style={{ color: '#44475b' }}>Holdings ({holdings.length})</h5>
                    <button className="btn btn-link text-groww-green fw-bold text-decoration-none p-0 small">Download Report</button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-dim fw-bold small uppercase border-0">Instrument</th>
                                <th className="py-3 text-dim fw-bold small uppercase border-0">Qty.</th>
                                <th className="py-3 text-dim fw-bold small uppercase border-0">Avg. Cost</th>
                                <th className="py-3 text-dim fw-bold small uppercase border-0">LTP</th>
                                <th className="py-3 text-dim fw-bold small uppercase border-0">Cur. Value</th>
                                <th className="px-4 py-3 text-dim fw-bold small uppercase border-0 text-end">P&L</th>
                            </tr>
                        </thead>
                        <tbody className="border-0">
                            {holdings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-dim border-0">
                                        <Briefcase size={48} className="mb-3 opacity-10" />
                                        <p className="mb-0 fw-medium">No assets in your portfolio yet.</p>
                                        <button className="btn btn-groww-outline btn-sm mt-3">Explore Stocks</button>
                                    </td>
                                </tr>
                            ) : (
                                holdings.map((item) => {
                                    const currentPrice = item.stockId?.currentPrice || 0;
                                    const pl = (currentPrice - item.averagePrice) * item.quantity;
                                    const isPlPositive = pl >= 0;

                                    return (
                                        <tr key={item._id} className="border-bottom border-light">
                                            <td className="px-4 py-4 border-0">
                                                <div className="fw-bold text-main fs-6">{item.stockId?.symbol}</div>
                                                <div className="small text-dim">{item.stockId?.name}</div>
                                            </td>
                                            <td className="py-4 border-0">
                                                <span className="fw-bold text-main">{item.quantity}</span>
                                            </td>
                                            <td className="py-4 border-0 text-dim">₹{item.averagePrice.toFixed(2)}</td>
                                            <td className="py-4 border-0 text-main fw-bold">₹{currentPrice.toFixed(2)}</td>
                                            <td className="py-4 border-0 text-main fw-bold">₹{(item.quantity * currentPrice).toLocaleString()}</td>
                                            <td className="px-4 py-4 border-0 text-end">
                                                <div className={`fw-bold ${isPlPositive ? 'text-groww-green' : 'text-groww-red'}`}>
                                                    {isPlPositive ? '+' : ''}₹{pl.toFixed(2)}
                                                </div>
                                                <div className={`small ${isPlPositive ? 'text-groww-green' : 'text-groww-red'} opacity-75`}>
                                                    {isPlPositive ? '+' : ''}{((pl / (item.averagePrice * item.quantity)) * 100).toFixed(2)}%
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-5 p-4 bg-secondary bg-opacity-10 rounded-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <Info size={20} className="text-dim" />
                    <h6 className="fw-bold mb-0" style={{ color: '#44475b' }}>Portfolio Insights</h6>
                </div>
                <p className="text-dim small mb-0">Your portfolio is diversified across {new Set(holdings.map(h => h.stockId?.symbol)).size} stocks. Consider investing in Mutual Funds for better risk management.</p>
            </div>
        </div>
    );
};

export default Portfolio;
