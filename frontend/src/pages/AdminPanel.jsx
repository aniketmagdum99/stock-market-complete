import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Settings, Users, Activity, Shield, Search, TrendingUp, Edit2, Trash2, Plus, X, UserCheck, UserX } from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [showStockForm, setShowStockForm] = useState(false);
    const [editingStock, setEditingStock] = useState(null);
    const [stockForm, setStockForm] = useState({ symbol: '', name: '', currentPrice: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, transRes, stocksRes] = await Promise.all([
                API.get('/admin/users'),
                API.get('/admin/transactions'),
                API.get('/stocks') // Public endpoint that returns all stocks
            ]);
            setUsers(usersRes.data);
            setTransactions(transRes.data);
            setStocks(stocksRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // User Actions
    const handleRoleChange = async (id, currentRole) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await API.put(`/admin/users/${id}`, { role: newRole });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating role');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/admin/users/${id}`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting user');
        }
    };

    // Stock Actions
    const handleStockSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStock) {
                await API.put(`/admin/stocks/${editingStock}`, stockForm);
            } else {
                await API.post('/admin/stocks', stockForm);
            }
            setShowStockForm(false);
            setEditingStock(null);
            setStockForm({ symbol: '', name: '', currentPrice: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving stock');
        }
    };

    const openEditStock = (stock) => {
        setEditingStock(stock._id);
        setStockForm({ symbol: stock.symbol, name: stock.name, currentPrice: stock.currentPrice });
        setShowStockForm(true);
    };

    const handleDeleteStock = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stock?')) return;
        try {
            await API.delete(`/admin/stocks/${id}`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting stock');
        }
    };

    // Filtering
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredTransactions = transactions.filter(t =>
        t.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.stockId?.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredStocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container pb-5">
            <header className="mb-5 d-flex align-items-center gap-4">
                <div className="p-3 rounded-4 bg-groww-blue bg-opacity-10 text-groww-blue shadow-sm">
                    <Settings size={32} />
                </div>
                <div>
                    <h1 className="fw-bold display-6 mb-1" style={{ color: '#44475b' }}>Admin <span className="text-groww-blue">Console</span></h1>
                    <p className="text-dim mb-0">System management and activity monitoring</p>
                </div>
            </header>

            <div className="d-flex bg-secondary bg-opacity-10 p-1 rounded-3 mb-5 d-inline-flex gap-1 overflow-auto">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`btn px-4 py-2 rounded-3 border-0 transition-all fw-bold text-nowrap ${activeTab === 'users' ? 'bg-white text-groww-blue shadow-sm' : 'text-dim'}`}
                >
                    <Users size={18} className="me-2" /> Users
                </button>
                <button
                    onClick={() => setActiveTab('stocks')}
                    className={`btn px-4 py-2 rounded-3 border-0 transition-all fw-bold text-nowrap ${activeTab === 'stocks' ? 'bg-white text-groww-blue shadow-sm' : 'text-dim'}`}
                >
                    <TrendingUp size={18} className="me-2" /> Stocks
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`btn px-4 py-2 rounded-3 border-0 transition-all fw-bold text-nowrap ${activeTab === 'transactions' ? 'bg-white text-groww-blue shadow-sm' : 'text-dim'}`}
                >
                    <Activity size={18} className="me-2" /> Activity
                </button>
            </div>

            <div className="card-minimal p-0 border-0 shadow-sm overflow-hidden rounded-4">
                <div className="bg-white p-4 border-bottom d-flex flex-wrap gap-3 justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0" style={{ color: '#44475b' }}>
                        {activeTab === 'users' && 'System Users'}
                        {activeTab === 'stocks' && 'Market Stocks'}
                        {activeTab === 'transactions' && 'System Logs'}
                    </h5>

                    <div className="d-flex gap-3 align-items-center">
                        {activeTab === 'stocks' && (
                            <button
                                onClick={() => { setShowStockForm(!showStockForm); setEditingStock(null); setStockForm({ symbol: '', name: '', currentPrice: '' }); }}
                                className="btn btn-groww-outline btn-sm d-flex align-items-center gap-1"
                            >
                                {showStockForm ? <X size={16} /> : <Plus size={16} />}
                                {showStockForm ? 'Cancel' : 'Add Stock'}
                            </button>
                        )}
                        <div className="input-group bg-light rounded-3 px-3 py-1" style={{ width: '250px' }}>
                            <Search size={16} className="text-dim mt-2" />
                            <input
                                type="text"
                                className="form-control border-0 bg-transparent shadow-none small"
                                placeholder="Search here..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {activeTab === 'stocks' && showStockForm && (
                    <div className="p-4 bg-light border-bottom">
                        <form onSubmit={handleStockSubmit} className="row g-3 align-items-end">
                            <div className="col-md-3">
                                <label className="form-label small fw-bold text-dim mb-1">Symbol</label>
                                <input type="text" required className="form-control" placeholder="e.g. AAPL" value={stockForm.symbol} onChange={e => setStockForm({ ...stockForm, symbol: e.target.value })} disabled={!!editingStock} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-dim mb-1">Company Name</label>
                                <input type="text" required className="form-control" placeholder="Apple Inc." value={stockForm.name} onChange={e => setStockForm({ ...stockForm, name: e.target.value })} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small fw-bold text-dim mb-1">Base Price (₹)</label>
                                <input type="number" required step="0.01" className="form-control" placeholder="150.00" value={stockForm.currentPrice} onChange={e => setStockForm({ ...stockForm, currentPrice: e.target.value })} />
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-groww w-100">{editingStock ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-groww-blue" role="status"></div>
                        <p className="text-dim mt-3">Fetching data...</p>
                    </div>
                ) : activeTab === 'users' ? (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0">Profile</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Email</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Role</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Balance</th>
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {filteredUsers.length === 0 ? <tr><td colSpan="5" className="text-center py-4 text-dim">No users found</td></tr> : null}
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="border-bottom border-light">
                                        <td className="px-4 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar rounded-circle bg-groww-blue bg-opacity-10 text-groww-blue d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px' }}>
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <span className="fw-bold text-main">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 border-0 text-dim">{user.email}</td>
                                        <td className="py-4 border-0">
                                            <span className={`badge rounded-pill px-3 py-2 ${user.role === 'admin' ? 'bg-groww-blue bg-opacity-10 text-groww-blue' : 'bg-light text-dim'}`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 border-0 fw-extrabold text-main">₹{user.balance.toLocaleString()}</td>
                                        <td className="px-4 py-4 border-0 text-end">
                                            <button onClick={() => handleRoleChange(user._id, user.role)} className="btn btn-sm btn-light text-dim me-2" title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}>
                                                {user.role === 'admin' ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                            <button onClick={() => handleDeleteUser(user._id)} className="btn btn-sm btn-light text-danger" title="Delete User">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'stocks' ? (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0">Symbol</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Company Name</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Current Price</th>
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {filteredStocks.length === 0 ? <tr><td colSpan="4" className="text-center py-4 text-dim">No stocks found</td></tr> : null}
                                {filteredStocks.map(stock => (
                                    <tr key={stock._id} className="border-bottom border-light">
                                        <td className="px-4 py-4 border-0"><span className="badge bg-secondary bg-opacity-10 text-main px-2 py-1 fs-6">{stock.symbol}</span></td>
                                        <td className="py-4 border-0 fw-bold">{stock.name}</td>
                                        <td className="py-4 border-0 text-main fw-bold">₹{stock.currentPrice.toFixed(2)}</td>
                                        <td className="px-4 py-4 border-0 text-end">
                                            <button onClick={() => openEditStock(stock)} className="btn btn-sm btn-light text-dim me-2"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteStock(stock._id)} className="btn btn-sm btn-light text-danger"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0">Date</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">User</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Symbol</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Type</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Qty</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Price</th>
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0 text-end">Value</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {filteredTransactions.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-dim">No transactions found</td></tr> : null}
                                {filteredTransactions.map(tx => (
                                    <tr key={tx._id} className="border-bottom border-light">
                                        <td className="px-4 py-4 border-0 text-dim small">{new Date(tx.timestamp).toLocaleString()}</td>
                                        <td className="py-4 border-0 fw-bold">{tx.userId?.name || '---'}</td>
                                        <td className="py-4 border-0"><span className="badge bg-secondary bg-opacity-10 text-main px-2 py-1">{tx.stockId?.symbol || '---'}</span></td>
                                        <td className="py-4 border-0"><span className={`fw-extrabold ${tx.type === 'buy' ? 'text-groww-green' : 'text-groww-red'}`}>{tx.type.toUpperCase()}</span></td>
                                        <td className="py-4 border-0 text-main fw-bold">{tx.quantity}</td>
                                        <td className="py-4 border-0 text-dim">₹{tx.price?.toFixed(2)}</td>
                                        <td className="px-4 py-4 border-0 text-end fw-extrabold text-main">₹{tx.totalAmount?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-5 p-4 card-minimal border-0 bg-secondary bg-opacity-10 rounded-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <Shield size={20} className="text-groww-blue" />
                    <h6 className="fw-bold mb-0" style={{ color: '#44475b' }}>System Security</h6>
                </div>
                <p className="text-dim small mb-0">All administrative actions are logged and audited. Ensure you are on a secure network before performing sensitive operations.</p>
            </div>
        </div>
    );
};

export default AdminPanel;
