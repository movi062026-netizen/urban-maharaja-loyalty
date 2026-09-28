import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'

  // Input states
  const [email, setEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 6-digit OTP array state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);

  const [loading, setLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Resend Countdown Timer
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === 'otp' && otpInputsRef.current[0]) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Request Email OTP for patron login
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Please enter a valid royal email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.requestOtp({ email: cleanEmail });
      toast.success(data.message || 'Royal verification seal dispatched to your email!');
      if (data.data?.devOtp) {
        setDevOtpHint(data.data.devOtp);
      }
      setResendTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to dispatch verification code');
    } finally {
      setLoading(false);
    }
  };

  // Login with Email or Mobile Number + Password
  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    const clean = loginIdentifier.trim();
    if (!clean) {
      toast.error('Please enter your royal email address or mobile number');
      return;
    }

    if (!clean.includes('@') && clean.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid email address or 10-digit mobile number');
      return;
    }

    if (!password) {
      toast.error('Please enter your secret password');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.guestLogin(clean, password);
      login(data.data.user, data.data.tokens);
      toast.success(`Welcome back to the Court, ${data.data.user.name || 'Noble Patron'}!`);
      navigate('/guest/card');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP input changes
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...otpDigits];

    // Handle single character
    if (cleanVal.length <= 1) {
      newDigits[index] = cleanVal;
      setOtpDigits(newDigits);

      if (cleanVal && index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }

      if (cleanVal && index === 5 && newDigits.every((d) => d !== '')) {
        verifyCode(newDigits.join(''));
      }
    } else {
      // Handle paste of multiple characters into this box
      const pasteChars = cleanVal.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasteChars[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasteChars.length, 5);
      otpInputsRef.current[nextIndex]?.focus();

      if (pasteChars.length >= 6) {
        verifyCode(newDigits.join(''));
      }
    }
  };

  // Handle Backspace and Arrow navigation in OTP boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Paste directly into segmented OTP boxes
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasteData.length, 5);
    otpInputsRef.current[nextIndex]?.focus();

    if (pasteData.length >= 6) {
      verifyCode(newDigits.join(''));
    }
  };

  // Execute OTP Verification
  const verifyCode = async (otpCode) => {
    if (!otpCode || otpCode.length < 4) {
      toast.error('Please enter the 6-digit royal verification seal');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data } = await authApi.verifyOtp({ email: cleanEmail }, otpCode.trim());
      login(data.data.user, data.data.tokens);
      toast.success(`Welcome to the Court of Urban Maharaja, ${data.data.user.name || 'Noble Patron'}!`);
      navigate('/guest/card');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    verifyCode(otpDigits.join(''));
  };

  // Dev mode auto fill
  const handleDevAutoFill = () => {
    if (!devOtpHint) return;
    const digits = devOtpHint.slice(0, 6).split('');
    setOtpDigits(digits);
    toast.success('Seal code auto-filled');
    verifyCode(devOtpHint);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data } = await authApi.requestOtp({ email: cleanEmail });
      toast.success('Fresh royal verification seal dispatched to your email!');
      if (data.data?.devOtp) {
        setDevOtpHint(data.data.devOtp);
      }
      setResendTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (window.google?.accounts?.id && googleClientId) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (response.credential) {
            await submitGoogleToken(response.credential);
          }
        },
      });
      window.google.accounts.id.prompt();
      return;
    }

    // Direct Google prompt
    const promptEmail = window.prompt(
      'Enter Google email to continue via Google OAuth:',
      email || 'patron@gmail.com'
    );
    if (!promptEmail) return;

    await submitGoogleToken(`mock_google_token_${promptEmail.trim().toLowerCase()}`);
  };

  const submitGoogleToken = async (idToken) => {
    setLoading(true);
    try {
      const { data } = await authApi.googleLogin(idToken);
      login(data.data.user, data.data.tokens);
      toast.success(data.message || `Welcome, ${data.data.user.name}!`);
      if (data.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.data.user.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else {
        navigate('/guest/card');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Active target identifier string for display
  const activeIdentifier = email.trim() || 'your royal email';

  return (
    <div className="min-h-screen min-h-dvh flex items-center justify-center bg-background px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden text-on-surface">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[520px] bg-primary-container/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] max-w-full h-[380px] bg-secondary/15 rounded-full blur-[130px]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        {/* Brand Crest & Header */}
        <div className="text-center mb-6">
          <Link to="/" className="no-underline inline-block group">
            <div className="relative w-16 h-16 rounded-2xl bg-surface-container-high/90 border border-primary/40 flex items-center justify-center mx-auto mb-3 shadow-[0_12px_32px_rgba(222,107,144,0.35)] group-hover:scale-105 transition-all">
              <span className="material-symbols-outlined text-primary text-[36px]">military_tech</span>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center text-[10px] font-bold shadow-md">
                ★
              </div>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl uppercase tracking-[0.2em] text-primary font-bold">
              URBAN MAHARAJA
            </h1>
            <p className="text-xs uppercase tracking-[0.26em] text-secondary font-semibold mt-1">
              DIGITAL MAHARAJA PORTAL
            </p>
          </Link>
        </div>

        {/* Authentication Card */}
        <div className="glass-card-royal p-5 sm:p-7 lg:p-9">
          {/* Header Title */}
          <div className="mb-6">
            <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
              {step === 'otp' ? 'Verify Royal Seal' : 'Patron Authentication'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {step === 'otp'
                ? `Enter the 6-digit seal dispatched to ${activeIdentifier}`
                : 'Sign in to access your Digital Maharaja Card, stamps, and rewards.'}
            </p>
          </div>

          {/* ── STEP 1: PATRON SIGN IN ───────────────────────────────────── */}
          {step === 'input' && (
            <div className="space-y-5">
              {/* Method Switcher Tabs: Email OTP vs Password */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loginMethod === 'otp'
                      ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                  <span>Email OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loginMethod === 'password'
                      ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Password</span>
                </button>
              </div>

              {loginMethod === 'otp' ? (
                /* Email OTP Sign In Form */
                <form onSubmit={handleRequestOtp} className="space-y-4">
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
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Dispatch Verification Seal</span>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Password Sign In Form */
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label htmlFor="pass-identifier" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                      Email Address or Mobile Number
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                        {loginIdentifier.includes('@')
                          ? 'alternate_email'
                          : loginIdentifier.replace(/\D/g, '').length > 0
                          ? 'phone_iphone'
                          : 'badge'}
                      </span>
                      <input
                        id="pass-identifier"
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="patron@urbanmaharaja.com or 9876543210"
                        className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                        autoComplete="username"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pass-password" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                      Secret Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                        lock
                      </span>
                      <input
                        id="pass-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your secret password"
                        className="w-full pl-11 pr-11 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Enter the Royal Court</span>
                        <span className="material-symbols-outlined text-[18px]">login</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Quick Demo Fill Helper */}
              <div className="pt-4 border-t border-outline-variant/30">
                <p className="text-[11px] uppercase tracking-wider text-on-surface-variant/70 text-center font-semibold mb-2">
                  One-Click Demo Patrons
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('patron@urbanmaharaja.com');
                      setLoginIdentifier('patron@urbanmaharaja.com');
                      setPassword('password123');
                      toast.success('Loaded patron@urbanmaharaja.com');
                    }}
                    className="p-2 rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-primary font-mono text-center transition-colors cursor-pointer"
                  >
                    Email Patron
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('password');
                      setLoginIdentifier('9876543210');
                      setPassword('password123');
                      toast.success('Loaded 9876543210');
                    }}
                    className="p-2 rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-secondary font-mono text-center transition-colors cursor-pointer"
                  >
                    Mobile Patron
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Social Google Login ────────────────────────────────────────── */}
          {step === 'input' && (
            <div className="mt-6 pt-5 border-t border-outline-variant/30">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="w-full border-t border-outline-variant/30" />
                <span className="bg-surface-container px-3 text-[10px] uppercase font-mono tracking-widest text-on-surface-variant font-bold absolute">
                  OR ROYAL GOOGLE AUTH
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl glass-surface border border-outline-variant/40 hover:border-primary/50 text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-md hover:bg-surface-container-high"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* ── STEP 2: VERIFY ROYAL OTP SEAL ────────────────────────────── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    6-Digit Royal Seal
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('input');
                      setOtpDigits(['', '', '', '', '', '']);
                      setDevOtpHint(null);
                    }}
                    className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    <span>Change Email</span>
                  </button>
                </div>

                {/* 6-Box Segmented OTP Inputs */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-full h-13 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border bg-surface-container text-on-surface transition-all focus:outline-none ${
                        digit
                          ? 'border-primary shadow-[0_0_12px_rgba(222,107,144,0.35)]'
                          : 'border-outline-variant/40 focus:border-secondary'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Dev Mode OTP Quick Fill Helper */}
              {devOtpHint && (
                <div className="p-3.5 rounded-xl bg-surface-container-high/90 border border-primary/40 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                    <span className="text-xs text-on-surface">
                      Dev Seal: <span className="font-mono font-bold text-primary tracking-wider">{devOtpHint}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDevAutoFill}
                    className="px-3 py-1.5 rounded-lg bg-primary-container text-surface-container-lowest text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer shadow"
                  >
                    1-Click Auto-Fill
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otpDigits.some((d) => d === '')}
                className="w-full py-4 rounded-xl glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

              {/* Resend OTP Row with Timer */}
              <div className="text-center pt-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer font-semibold underline underline-offset-4"
                  >
                    Resend Royal Verification Seal
                  </button>
                ) : (
                  <p className="text-xs text-on-surface-variant/70 font-mono">
                    Resend available in <span className="text-secondary font-bold">{resendTimer}s</span>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Switch to Register Link */}
          <div className="mt-7 pt-5 border-t border-outline-variant/30 text-center">
            <p className="text-xs text-on-surface-variant">
              New to the Royal Court?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-fixed font-bold underline underline-offset-4 transition-colors"
              >
                Join Royalty / Create Account
              </Link>
            </p>
          </div>

          {/* Links Back & Distinct Staff / Admin Portals */}
          <div className="mt-5 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant/70">
            <div className="flex items-center gap-2.5">
              <Link
                to="/staff/login"
                className="hover:text-secondary transition-colors no-underline flex items-center gap-1 font-medium"
              >
                <span className="material-symbols-outlined text-[14px]">badge</span>
                <span>Staff Terminal</span>
              </Link>
              <span className="text-outline-variant/50">•</span>
              <Link
                to="/admin/login"
                className="hover:text-primary transition-colors no-underline flex items-center gap-1 font-medium"
              >
                <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                <span>Admin Portal</span>
              </Link>
            </div>
            <Link
              to="/"
              className="hover:text-secondary transition-colors no-underline flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-[14px]">home</span>
              <span>Back to Palace</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
