import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter administrator email and password');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.adminLogin(email.trim().toLowerCase(), password);
      login(data.data.user, data.data.tokens);
      toast.success(`Executive access granted. Welcome, ${data.data.user.name}`);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Administrator authentication failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail = 'admin@urbanmaharaja.com', defaultPass = 'Admin@123') => {
    setEmail(roleEmail);
    setPassword(defaultPass);
    toast.success(`Loaded credentials for ${roleEmail}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden text-on-surface">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-full h-[500px] bg-primary-container/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[400px] max-w-full h-[350px] bg-secondary-container/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 py-12">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="no-underline inline-block group">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high/90 border border-primary/40 flex items-center justify-center mx-auto mb-3 shadow-[0_12px_28px_rgba(222,107,144,0.3)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary text-[34px]">admin_panel_settings</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold tracking-wider uppercase">
              Urban Maharaja
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary font-semibold mt-1">
              Executive Admin Portal
            </p>
          </Link>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="p-7 sm:p-9 rounded-3xl bg-surface-container/85 border border-primary/30 backdrop-blur-2xl shadow-[0_24px_50px_rgba(46,26,20,0.12)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-1.5">
                <span className="material-symbols-outlined text-[13px]">shield</span>
                <span>Restricted Management</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
                Administrator Login
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
                Access system controls, analytics, audits & staff management
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-[28px]">lock_person</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                Official Administrator Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                  alternate_email
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@urbanmaharaja.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Administrator Passkey
                </label>
                <div className="flex items-center gap-3">
                  <Link
                    to={email ? `/forgot-password?email=${encodeURIComponent(email.trim())}` : '/forgot-password'}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Forgot Passkey?
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                  key
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans tracking-wide"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Executive Console</span>
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@urbanmaharaja.com', 'Admin@123')}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest border border-primary/30 text-xs text-primary font-mono text-center transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>1-Click Load Super Admin (admin@urbanmaharaja.com)</span>
            </button>
          </div>

          {/* Dedicated Link to Staff Terminal */}
          <div className="mt-6 pt-4 border-t border-outline-variant/30 text-center">
            <p className="text-xs text-on-surface-variant">
              Looking for Floor Staff & Concierge?{' '}
              <Link
                to="/staff/login"
                className="text-secondary hover:text-primary font-bold underline underline-offset-4 transition-colors"
              >
                Go to Staff Terminal →
              </Link>
            </p>
          </div>

          {/* Links Back */}
          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant/70">
            <Link to="/login" className="hover:text-primary transition-colors no-underline">
              ← Guest Patron Login
            </Link>
            <Link to="/" className="hover:text-secondary transition-colors no-underline">
              Return to Website →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
