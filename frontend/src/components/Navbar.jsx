import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { TrendingUp, LayoutDashboard, Briefcase, User, LogOut, Wallet, Search, Bell } from 'lucide-react';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        `nav-link fw-bold px-3 py-2 rounded-2 transition-all ${isActive ? 'text-groww-green bg-groww-green bg-opacity-10' : 'text-main hover-bg-light'}`;

    return (
        <nav className="navbar navbar-expand-lg sticky-top navbar-groww shadow-sm">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2 hover-lift" to="/">
                    <div className="p-1 bg-groww-green rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                    <span className="fw-extrabold fs-3" style={{ color: 'var(--text-main)', letterSpacing: '-1px' }}>StockTrade</span>
                </Link>

                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Premium Search Bar */}
                    <div className="mx-lg-5 flex-grow-1 d-none d-lg-block" style={{ maxWidth: '440px' }}>
                        <div className="input-group bg-secondary bg-opacity-10 rounded-pill px-3 py-1 border border-transparent focus-within-green transition-all">
                            <span className="input-group-text border-0 bg-transparent text-dim p-0 me-2">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 bg-transparent shadow-none p-2 small fw-medium"
                                placeholder="Search stocks, mutual funds, ETFs"
                                style={{ fontSize: '0.95rem' }}
                            />
                        </div>
                    </div>

                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        {userInfo ? (
                            <>
                                <li className="nav-item">
                                    <NavLink className={navLinkClass} to="/dashboard">Market</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={navLinkClass} to="/portfolio">Portfolio</NavLink>
                                </li>
                                {userInfo.role === 'admin' && (
                                    <li className="nav-item">
                                        <NavLink className={navLinkClass} to="/admin">Admin</NavLink>
                                    </li>
                                )}
                                <li className="nav-item d-none d-lg-block ms-2">
                                    <button className="btn btn-link text-dim p-2 hover-bg-light rounded-circle transition-all">
                                        <Bell size={20} />
                                    </button>
                                </li>
                                <li className="nav-item dropdown ms-2">
                                    <div className="d-flex align-items-center gap-2 cursor-pointer p-1 pe-3 rounded-pill bg-secondary bg-opacity-10 hover-bg-opacity-20 transition-all" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: 'pointer' }}>
                                        <div className="avatar rounded-circle bg-groww-green text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '34px', height: '34px' }}>
                                            {userInfo.name[0].toUpperCase()}
                                        </div>
                                        <span className="fw-bold text-main d-none d-md-inline small">{userInfo.name.split(' ')[0]}</span>
                                    </div>
                                    <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-3 p-2 rounded-4 animate-fade-in" aria-labelledby="userMenu">
                                        <div className="px-3 py-2 mb-2 border-bottom">
                                            <p className="small text-dim mb-0 fw-bold">Signed in as</p>
                                            <p className="small text-main mb-0 fw-extrabold text-truncate">{userInfo.email}</p>
                                        </div>
                                        <li><Link className="dropdown-item rounded-3 py-2 fw-bold small" to="/portfolio">My Portfolio</Link></li>
                                        <li><Link className="dropdown-item rounded-3 py-2 fw-bold small" to="/dashboard">Market Overview</Link></li>
                                        <li><hr className="dropdown-divider opacity-10" /></li>
                                        <li>
                                            <button className="dropdown-item rounded-3 py-2 text-danger fw-bold small d-flex align-items-center gap-2" onClick={logoutHandler}>
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold text-main px-4" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-groww px-4 shadow-sm" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-bg-light:hover { background: var(--bg-secondary); }
                .hover-bg-opacity-20:hover { background: rgba(0,0,0,0.05); }
                .focus-within-green:focus-within {
                    border-color: var(--groww-green) !important;
                    background: white !important;
                    box-shadow: 0 0 0 4px rgba(0, 208, 156, 0.1);
                }
                .animate-fade-in {
                    animation: fadeInSmall 0.2s ease-out;
                }
                @keyframes fadeInSmall {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </nav>
    );
};

export default Navbar;
