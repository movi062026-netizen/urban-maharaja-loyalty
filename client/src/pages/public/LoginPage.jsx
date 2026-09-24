import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Request OTP for returning patron login
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid royal email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.requestOtp({ email: email.trim() });
      toast.success(data.message || 'Royal verification seal dispatched to your email');
      if (data.data?.devOtp) {
        setDevOtpHint(data.data.devOtp);
      }
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to dispatch verification code');
    } finally {
      setLoading(false);
    }
  };

  // Register new patron account
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) {
      toast.error('Please enter your full noble name');
      return;
    }
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.registerCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      toast.success(data.message || 'Royal account created! Seal dispatched');
      if (data.data?.devOtp) {
        setDevOtpHint(data.data.devOtp);
      }
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      toast.error('Please enter the 6-digit verification seal');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.verifyOtp(email.trim(), otp.trim());
      login(data.data.user, data.data.tokens);
      toast.success(`Welcome to the Court of Urban Maharaja, ${data.data.user.name}!`);
      // Navigate to guest Maharaja Card portal
      navigate('/maharaja-card');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoEmail = (demoEmail) => {
    setEmail(demoEmail);
    toast.success(`Selected ${demoEmail}`);
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
              <span className="material-symbols-outlined text-primary text-[34px]">military_tech</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.18em] text-primary font-bold">
              URBAN MAHARAJA
            </h1>
            <p className="text-xs uppercase tracking-[0.24em] text-secondary font-semibold mt-1">
              DIGITAL MAHARAJA PORTAL
            </p>
          </Link>
        </div>

        {/* Authentication Card */}
        <div className="p-7 sm:p-9 rounded-3xl bg-surface-container/85 border border-outline-variant/40 backdrop-blur-2xl shadow-[0_24px_50px_rgba(24,10,12,0.95)]">
          {/* Mode Switcher Tabs (when in input step) */}
          {step === 'input' && (
            <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Patron Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Join Royalty
              </button>
            </div>
          )}

          {/* Header Title */}
          <div className="mb-6">
            <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
              {step === 'otp'
                ? 'Verify Royal Seal'
                : mode === 'login'
                ? 'Patron Authentication'
                : 'Create Royal Account'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {step === 'otp'
                ? `Enter the 6-digit seal dispatched to ${email}`
                : mode === 'login'
                ? 'Enter your email address to receive a secure login OTP seal'
                : 'Register your royal credentials to receive your Digital Maharaja Card'}
            </p>
          </div>

          {/* ── STEP 1: PATRON SIGN IN ───────────────────────────────────── */}
          {step === 'input' && mode === 'login' && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                  Patron Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    alternate_email
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@urbanmaharaja.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    autoComplete="email"
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
                    <span>Dispatch Royal Seal (OTP)</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </>
                )}
              </button>

              {/* Quick Demo Patron Helper */}
              <div className="pt-4 border-t border-outline-variant/30 text-center">
                <p className="text-[11px] uppercase tracking-wider text-on-surface-variant/70 font-semibold mb-2">
                  Demo Patron One-Click Fill
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoEmail('patron@urbanmaharaja.com')}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-primary font-mono transition-colors cursor-pointer"
                  >
                    patron@urbanmaharaja.com
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── STEP 1: PATRON REGISTRATION ─────────────────────────────── */}
          {step === 'input' && mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                  Full Noble Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    person
                  </span>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Princess Gayatri Devi"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                  Royal Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    alternate_email
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gayatri@royalmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                  Mobile Number <span className="text-[10px] text-on-surface-variant/60 lowercase">(optional for SMS)</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    phone
                  </span>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Maharaja Account</span>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── STEP 2: VERIFY ROYAL OTP SEAL ────────────────────────────── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="otp-input" className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    6-Digit Royal Seal
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('input');
                      setOtp('');
                      setDevOtpHint(null);
                    }}
                    className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    lock_open
                  </span>
                  <input
                    id="otp-input"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-center tracking-[0.35em] font-mono text-xl font-bold focus:outline-none focus:border-primary transition-colors"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Dev Mode OTP Quick Fill Helper */}
              {devOtpHint && (
                <div className="p-3.5 rounded-xl bg-surface-container-high/80 border border-primary/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">mark_email_read</span>
                    <span className="text-xs text-on-surface">
                      Dev OTP: <span className="font-mono font-bold text-primary">{devOtpHint}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(devOtpHint)}
                    className="px-2.5 py-1 rounded bg-primary-container text-surface-container-lowest text-[11px] font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify &amp; Enter Court</span>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Links Back & Staff Switch */}
          <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant/70">
            <Link to="/admin/login" className="hover:text-primary transition-colors no-underline">
              Staff &amp; Admin Terminal →
            </Link>
            <Link to="/" className="hover:text-secondary transition-colors no-underline">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
