import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, Phone, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.requestOtp(phone);
      toast.success('OTP sent to your phone');
      // In dev mode, show OTP
      if (data.data?.devOtp) {
        toast(`Dev OTP: ${data.data.devOtp}`, { icon: '🔐', duration: 10000 });
      }
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.verifyOtp(phone, otp);
      login(data.data.user, data.data.tokens);
      toast.success('Welcome to Urban Maharaja!');
      navigate('/maharaja-card');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-brown px-4">
      <div className="w-full max-w-sm animate-fadeIn">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="no-underline inline-block">
            <Crown className="w-10 h-10 text-royal-gold mx-auto mb-3" />
            <h1 className="font-serif text-2xl text-white tracking-wide">URBAN MAHARAJA</h1>
            <p className="text-royal-gold/60 text-xs tracking-[0.3em] mt-1">A FINE DINE</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-royal-lg">
          <h2 className="font-serif text-xl text-deep-brown text-center mb-1">Guest Login</h2>
          <p className="text-deep-brown/50 text-sm text-center mb-6">Enter your phone to access your Maharaja Card</p>

          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp}>
              <label htmlFor="phone" className="block text-sm font-medium text-deep-brown/70 mb-2">
                Phone Number
              </label>
              <div className="relative mb-5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-brown/30" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-3 border border-warm-beige rounded-xl text-deep-brown focus:outline-none focus:ring-2 focus:ring-royal-gold/50 focus:border-royal-gold transition-colors"
                  autoComplete="tel"
                  required
                  minLength={10}
                  maxLength={15}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-royal w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send OTP <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <p className="text-sm text-deep-brown/50 mb-4 text-center">
                OTP sent to <strong className="text-deep-brown">{phone}</strong>
              </p>
              <label htmlFor="otp" className="block text-sm font-medium text-deep-brown/70 mb-2">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-warm-beige rounded-xl text-deep-brown text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-royal-gold/50 focus:border-royal-gold transition-colors mb-5"
                autoComplete="one-time-code"
                required
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-royal w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify & Login <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-sm text-deep-brown/40 hover:text-royal-rose mt-3 bg-transparent border-none cursor-pointer"
              >
                Change phone number
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 flex items-center justify-center gap-2 text-white/30 text-xs">
          <Shield className="w-3 h-3" />
          <span>Your data is secure and private</span>
        </div>

        <div className="text-center mt-4">
          <Link to="/admin/login" className="text-white/20 text-xs hover:text-white/40 no-underline">
            Staff / Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
