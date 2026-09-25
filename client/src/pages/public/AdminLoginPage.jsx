import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    setLoading(true);
    try {
      const { data } = await authApi.adminLogin(email, password);
      login(data.data.user, data.data.tokens);
      toast.success(`Access granted. Welcome, ${data.data.user.name}`);
      if (data.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.data.user.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else {
        navigate('/guest/card');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail, defaultPass = 'Admin@123') => {
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
              <span className="material-symbols-outlined text-primary text-[34px]">shield_person</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold tracking-wider uppercase">
              Urban Maharaja
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary font-semibold mt-1">
              Concierge & Admin Terminal
            </p>
          </Link>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="p-7 sm:p-9 rounded-3xl bg-surface-container/85 border border-outline-variant/40 backdrop-blur-2xl shadow-[0_24px_50px_rgba(24,10,12,0.95)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
                Staff Authentication
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
                Sign in to manage stamps, rewards & guest analytics
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                Official Staff Email
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
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Terminal Key (Password)
                </label>
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

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                  lock
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
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Access Staff Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">key</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-outline-variant/30">
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant/70 text-center font-semibold mb-2.5">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@urbanmaharaja.com', 'Admin@123')}
                className="px-3 py-2 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-primary font-mono text-center transition-colors cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@urbanmaharaja.com', 'Staff@123')}
                className="px-3 py-2 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-secondary font-mono text-center transition-colors cursor-pointer"
              >
                Staff Concierge
              </button>
            </div>
          </div>

          {/* Links Back */}
          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant/70">
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
