import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/authSlice';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) navigate('/dashboard');
        return () => dispatch(clearError());
    }, [userInfo, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card-minimal p-5 shadow-lg border-0" style={{ maxWidth: '480px', width: '100%', background: '#ffffff' }}>
                <div className="text-center mb-5">
                    <div className="d-inline-flex p-3 rounded-4 bg-secondary bg-opacity-10 text-groww-green mb-4">
                        <LogIn size={32} />
                    </div>
                    <h1 className="fw-bold mb-2" style={{ color: '#44475b' }}>Login to <span className="text-groww-green">StockTrade</span></h1>
                    <p className="text-dim">Securely access your investment portfolio</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small mb-4 py-3 rounded-3 fw-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-dim small fw-bold uppercase mb-2 d-block">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-light text-dim px-3">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                className="form-control bg-light border-light text-main p-3"
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="d-flex justify-content-between mb-2">
                            <label className="text-dim small fw-bold uppercase">Password</label>
                            <Link to="#" className="text-groww-green small fw-bold text-decoration-none">Forgot?</Link>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-light text-dim px-3">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                className="form-control bg-light border-light text-main p-3"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-groww w-100 py-3 rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-extrabold fs-5" disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <>
                                <span>Login</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-dim mb-4">
                        Don't have an account? <Link to="/register" className="text-groww-green text-decoration-none fw-bold">Register Now</Link>
                    </p>
                    <div className="pt-4 border-top d-flex align-items-center justify-content-center gap-2 text-light small">
                        <ShieldCheck size={16} className="text-groww-green" />
                        SSL Secured Trading Environment
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
