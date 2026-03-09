import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/authSlice';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) navigate('/dashboard');
        return () => dispatch(clearError());
    }, [userInfo, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card-minimal p-5 shadow-lg border-0" style={{ maxWidth: '480px', width: '100%', background: '#ffffff' }}>
                <div className="text-center mb-5">
                    <div className="d-inline-flex p-3 rounded-4 bg-secondary bg-opacity-10 text-groww-blue mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="fw-bold mb-2" style={{ color: '#44475b' }}>Create <span className="text-groww-blue">Account</span></h1>
                    <p className="text-dim">Join over 1Cr+ investors in India</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small mb-4 py-3 rounded-3 fw-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-dim small fw-bold uppercase mb-2 d-block">Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-light text-dim px-3">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-light text-main p-3"
                                placeholder="E.g. John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

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
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="text-dim small fw-bold uppercase mb-2 d-block">Set Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-light text-dim px-3">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                className="form-control bg-light border-light text-main p-3"
                                placeholder="Min. 8 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-groww w-100 py-3 rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-extrabold fs-5" style={{ background: 'var(--groww-blue)' }} disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <>
                                <span>Get Started</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-dim mb-4">
                        Already have an account? <Link to="/login" className="text-groww-blue text-decoration-none fw-bold">Login Here</Link>
                    </p>
                    <div className="pt-4 border-top d-flex align-items-center justify-content-center gap-2 text-light small">
                        <ShieldCheck size={16} className="text-groww-blue" />
                        Encrypted Data & Privacy Guaranteed
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
