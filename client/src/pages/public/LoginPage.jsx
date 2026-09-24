import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState(null);
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
      toast.success('Royal verification OTP dispatched');
      if (data.data?.devOtp) {
        setDevOtpHint(data.data.devOtp);
        toast(`Dev OTP: ${data.data.devOtp}`, { icon: '👑', duration: 12000 });
      }
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to dispatch verification code');
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
      toast.success('Welcome back, Sovereign Guest!');
      navigate('/guest/card');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden text-on-surface">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[350px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 py-12">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="no-underline inline-block group">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high/90 border border-primary/40 flex items-center justify-center mx-auto mb-3 shadow-[0_8px_20px_rgba(222,107,144,0.3)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">crown</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm uppercase tracking-[0.22em] text-primary font-bold">
              URBAN MAHARAJA
            </h1>
            <p className="font-label-sm text-label-sm uppercase tracking-[0.24em] text-secondary font-semibold mt-1">
              DIGITAL MAHARAJA PORTAL
            </p>
          </Link>
        </div>

        {/* Card Box */}
        <div className="p-8 rounded-3xl bg-surface-container/85 border border-outline-variant/40 backdrop-blur-2xl shadow-[0_24px_50px_rgba(24,10,12,0.95)]">
          <div className="text-center mb-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
              {step === 'phone' ? 'Patron Sign In' : 'Verify Royal Seal'}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {step === 'phone'
                ? 'Enter your mobile number to access your Digital Maharaja Card'
                : `Enter the 6-digit seal dispatched to ${phone}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label htmlFor="phone" className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    phone
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-body-sm focus:outline-none focus:border-primary"
                    required
                    minLength={10}
                    maxLength={15}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-label-md uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="otp" className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    6-Digit Royal OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setDevOtpHint(null);
                    }}
                    className="text-xs text-secondary hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    lock
                  </span>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface tracking-widest text-center text-lg font-mono focus:outline-none focus:border-primary"
                    required
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {devOtpHint && (
                  <div className="mt-2 p-2.5 rounded-lg bg-surface-container-high/80 border border-secondary/30 text-center">
                    <p className="text-xs text-secondary font-mono">
                      Development OTP: <strong className="text-on-surface">{devOtpHint}</strong>
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-label-md uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Unlock Maharaja Card</span>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full text-center text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer pt-2"
              >
                Didn't receive code? Resend OTP
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
            <Link
              to="/admin/login"
              className="text-xs text-on-surface-variant/70 hover:text-secondary transition-colors no-underline font-label-sm uppercase tracking-wider"
            >
              Staff & Concierge Terminal Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
