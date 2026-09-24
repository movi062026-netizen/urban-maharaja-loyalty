import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.adminLogin(email, password);
      login(data.data.user, data.data.tokens);
      toast.success(`Welcome, ${data.data.user.name}`);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-brown px-4">
      <div className="w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-8">
          <Crown className="w-10 h-10 text-royal-gold mx-auto mb-3" />
          <h1 className="font-serif text-2xl text-white tracking-wide">ADMIN PANEL</h1>
          <p className="text-royal-gold/60 text-xs tracking-[0.2em] mt-1">URBAN MAHARAJA</p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-royal-lg">
          <h2 className="font-serif text-xl text-deep-brown text-center mb-6">Staff Login</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-sm font-medium text-deep-brown/70 mb-2">Email</label>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-brown/30" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@urbanmaharaja.com"
                className="w-full pl-10 pr-4 py-3 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 focus:border-royal-gold transition-colors"
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="password" className="block text-sm font-medium text-deep-brown/70 mb-2">Password</label>
            <div className="relative mb-6">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-brown/30" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 focus:border-royal-gold transition-colors"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-royal w-full flex items-center justify-center gap-2 py-3">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Login <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className="text-white/20 text-xs hover:text-white/40 no-underline">
            ← Guest Login
          </Link>
        </div>
      </div>
    </div>
  );
}
