import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Leaf, LogOut, History, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = user
        ? [
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/history', label: 'History', icon: History },
        ]
        : [];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 glass-strong"
            style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold font-['Outfit'] tracking-tight hidden sm:block">
                            <span className="gradient-text">Phyto</span>
                            <span className="text-slate-300">Guard</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                        ? 'bg-indigo-500/15 text-indigo-400'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-slate-400">
                                    <span className="text-slate-500">Hello,</span>{' '}
                                    <span className="text-indigo-400 font-medium">{user.email?.split('@')[0]}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn-outline text-sm !py-2 !px-5">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm !py-2 !px-5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden glass-strong border-t border-white/5 px-4 pb-4"
                    style={{ borderRadius: 0 }}
                >
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(to) ? 'bg-indigo-500/15 text-indigo-400' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 mt-2">
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-sm text-center !py-2">Login</Link>
                            <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center !py-2">Sign Up</Link>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
}
