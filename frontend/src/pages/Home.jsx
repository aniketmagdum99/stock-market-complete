import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Smartphone, PieChart, Activity, Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="container py-5 mt-4">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <h1 className="display-3 fw-bold mb-4" style={{ color: '#44475b', lineHeight: '1.1' }}>
                            India’s stock market at your <span className="text-gradient-groww">fingertips.</span>
                        </h1>
                        <p className="fs-5 text-dim mb-5" style={{ maxWidth: '90%' }}>
                            Invest in Stocks, Mutual Funds, IPOs, and more on a single platform. Zero account opening charges and hidden fees.
                        </p>
                        <Link to="/register" className="btn btn-groww btn-lg px-5 py-3 shadow-lg">
                            Get started
                        </Link>
                        <div className="mt-4 text-light small d-flex align-items-center gap-2">
                            <ShieldCheck size={16} className="text-groww-green" />
                            Trusted by 1Cr+ active members in India
                        </div>
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="/fintech_hero_illustration_1772449778716.png"
                            alt="Trading Illustration"
                            className="img-fluid floating-animation"
                            style={{ maxHeight: '500px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="bg-secondary bg-opacity-10 py-5 mt-5">
                <div className="container py-4">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-3">
                            <div className="card-minimal h-100 text-center">
                                <TrendingUp className="text-groww-green mb-3 mx-auto" size={40} />
                                <h5 className="fw-bold">Stocks</h5>
                                <p className="text-dim small mb-0">Direct Equity, Intraday, and F&O trading</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card-minimal h-100 text-center">
                                <Smartphone className="text-groww-blue mb-3 mx-auto" size={40} />
                                <h5 className="fw-bold">ETFs</h5>
                                <p className="text-dim small mb-0">Invest in gold, silver, and sectors</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card-minimal h-100 text-center">
                                <Activity className="text-groww-red mb-3 mx-auto" size={40} />
                                <h5 className="fw-bold">IPOs</h5>
                                <p className="text-dim small mb-0">Apply for upcoming public listings</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card-minimal h-100 text-center">
                                <Globe className="text-groww-green mb-3 mx-auto" size={40} />
                                <h5 className="fw-bold">Bonds</h5>
                                <p className="text-dim small mb-0">Secure interest with regular payouts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SIP Section */}
            <div className="container py-5 my-5">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold mb-3" style={{ color: '#44475b' }}>Build wealth, <span className="text-groww-green">SIP by SIP</span></h2>
                    <p className="text-dim fs-5">Invest in Direct Mutual Funds without any commission.</p>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card-minimal p-0 overflow-hidden border-0 shadow-lg">
                            <div className="bg-light p-4 border-bottom d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-groww-green rounded-circle text-white">
                                        <PieChart size={24} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">India Hybrid Fund</h5>
                                        <small className="text-dim">Medium Risk • Hybrid</small>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="text-groww-green fw-bold fs-4">16.32%</div>
                                    <small className="text-dim">3Y Annualised</small>
                                </div>
                            </div>
                            <div className="p-4 bg-white" style={{ height: '300px' }}>
                                {/* Mock Chart Path */}
                                <svg viewBox="0 0 800 200" className="w-100 h-100">
                                    <path
                                        d="M0,150 Q100,160 200,120 T400,100 T600,60 T800,20"
                                        fill="none"
                                        stroke="#00d09c"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M0,150 Q100,160 200,120 T400,100 T600,60 T800,20 L800,200 L0,200 Z"
                                        fill="url(#gradient)"
                                        opacity="0.1"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#00d09c', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#00d09c', stopOpacity: 0 }} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="p-4 bg-light border-top text-center">
                                <button className="btn btn-groww px-5">Start SIP Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Minimal */}
            <footer className="py-5 border-top">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <div className="p-2 bg-groww-green rounded-circle text-white">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="fw-bold fs-4" style={{ color: '#44475b' }}>StockTrade</span>
                            </div>
                            <p className="text-dim small mb-0">© 2026 StockTrade. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="d-flex justify-content-md-end gap-4 mt-3 mt-md-0">
                                <a href="#" className="text-dim text-decoration-none small">Terms</a>
                                <a href="#" className="text-dim text-decoration-none small">Privacy</a>
                                <a href="#" className="text-dim text-decoration-none small">Pricing</a>
                                <a href="#" className="text-dim text-decoration-none small">Help</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .floating-animation {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
            ` }} />
        </div>
    );
};

export default Home;
