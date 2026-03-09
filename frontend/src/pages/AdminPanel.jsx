import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Settings, Users, History, Activity, Shield, ChevronRight, Search } from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, transRes] = await Promise.all([
                    API.get('/admin/users'),
                    API.get('/admin/transactions')
                ]);
                setUsers(usersRes.data);
                setTransactions(transRes.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

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

            <div className="d-flex bg-secondary bg-opacity-10 p-1 rounded-3 mb-5 d-inline-flex gap-1">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`btn px-4 py-2 rounded-3 border-0 transition-all fw-bold ${activeTab === 'users' ? 'bg-white text-groww-blue shadow-sm' : 'text-dim'}`}
                >
                    <Users size={18} className="me-2" /> Users
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`btn px-4 py-2 rounded-3 border-0 transition-all fw-bold ${activeTab === 'transactions' ? 'bg-white text-groww-blue shadow-sm' : 'text-dim'}`}
                >
                    <Activity size={18} className="me-2" /> Activity
                </button>
            </div>

            <div className="card-minimal p-0 border-0 shadow-sm overflow-hidden rounded-4">
                <div className="bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0" style={{ color: '#44475b' }}>System {activeTab === 'users' ? 'Users' : 'Logs'}</h5>
                    <div className="input-group bg-light rounded-3 px-3 py-1" style={{ maxWidth: '300px' }}>
                        <Search size={16} className="text-dim mt-2" />
                        <input type="text" className="form-control border-0 bg-transparent shadow-none small" placeholder="Search..." />
                    </div>
                </div>

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
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0 text-end">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {users.map(user => (
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
                                        <td className="px-4 py-4 border-0 text-end fw-extrabold text-main">
                                            ₹{user.balance.toLocaleString()}
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
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0">User</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Symbol</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Type</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Qty</th>
                                    <th className="py-3 text-dim fw-bold small uppercase border-0">Price</th>
                                    <th className="px-4 py-3 text-dim fw-bold small uppercase border-0 text-end">Value</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {transactions.map(tx => (
                                    <tr key={tx._id} className="border-bottom border-light">
                                        <td className="px-4 py-4 border-0 fw-bold">{tx.userId?.name || '---'}</td>
                                        <td className="py-4 border-0">
                                            <span className="badge bg-secondary bg-opacity-10 text-main px-2 py-1">{tx.stockId?.symbol || '---'}</span>
                                        </td>
                                        <td className="py-4 border-0">
                                            <span className={`fw-extrabold ${tx.type === 'buy' ? 'text-groww-green' : 'text-groww-red'}`}>
                                                {tx.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 border-0 text-main fw-bold">{tx.quantity}</td>
                                        <td className="py-4 border-0 text-dim">₹{tx.price?.toFixed(2)}</td>
                                        <td className="px-4 py-4 border-0 text-end fw-extrabold text-main">
                                            ₹{tx.totalAmount?.toLocaleString()}
                                        </td>
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
