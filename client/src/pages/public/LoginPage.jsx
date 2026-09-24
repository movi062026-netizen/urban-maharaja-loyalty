import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [step, setStep] = useState('input'); // 'input' | 'otp'

  // Input states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

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

  // Request OTP for returning patron login
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();

    let payload = {};
    if (loginMethod === 'email') {
      const cleanEmail = email.trim();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        toast.error('Please enter a valid royal email address');
        return;
      }
      payload = { email: cleanEmail };
    } else {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }
      payload = { phone: cleanPhone };
    }

    setLoading(true);
    try {
      const { data } = await authApi.requestOtp(payload);
      toast.success(data.message || 'Royal verification seal dispatched!');
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

  // Register new patron account ("Join Royalty")
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) {
      toast.error('Please enter your full noble name');
      return;
    }
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid royal email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.registerCustomer({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() ? phone.trim().replace(/\D/g, '') : undefined,
      });
      toast.success(data.message || 'Royal account created! Seal dispatched');
      if (data.data?.devOtp) {
        setDevOtpHint(data.data.devOtp);
      }
      setResendTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
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

      // Auto-advance to next box if filled
      if (cleanVal && index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }

      // If all 6 digits are entered, auto-verify
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

  // Handle pasting full OTP
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
      const identifier = loginMethod === 'email' || mode === 'register'
        ? { email: email.trim().toLowerCase() }
        : { phone: phone.trim().replace(/\D/g, '') };

      const { data } = await authApi.verifyOtp(identifier, otpCode.trim());
      login(data.data.user, data.data.tokens);
      toast.success(`Welcome to the Court of Urban Maharaja, ${data.data.user.name || 'Noble Patron'}!`);
      navigate('/maharaja-card');
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
      let payload = {};
      if (loginMethod === 'email' || mode === 'register') {
        payload = { email: email.trim().toLowerCase() };
      } else {
        payload = { phone: phone.trim().replace(/\D/g, '') };
      }
      const { data } = await authApi.requestOtp(payload);
      toast.success('Fresh royal verification seal dispatched!');
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

  // Active target identifier string for display
  const activeIdentifier = mode === 'register' || loginMethod === 'email'
    ? email.trim() || 'your royal email'
    : `+91 ${phone.trim() || 'mobile'}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden text-on-surface">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[520px] bg-primary-container/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] max-w-full h-[380px] bg-secondary/15 rounded-full blur-[130px]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Crest & Header */}
        <div className="text-center mb-7">
          <Link to="/" className="no-underline inline-block group">
            <div className="relative w-16 h-16 rounded-2xl bg-surface-container-high/90 border border-primary/40 flex items-center justify-center mx-auto mb-3 shadow-[0_12px_32px_rgba(222,107,144,0.35)] group-hover:scale-105 transition-all">
              <span className="material-symbols-outlined text-primary text-[36px]">military_tech</span>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center text-[10px] font-bold shadow-md">
                ★
              </div>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.2em] text-primary font-bold">
              URBAN MAHARAJA
            </h1>
            <p className="text-xs uppercase tracking-[0.26em] text-secondary font-semibold mt-1">
              DIGITAL MAHARAJA PORTAL
            </p>
          </Link>
        </div>

        {/* Authentication Card */}
        <div className="p-7 sm:p-9 rounded-3xl bg-surface-container/85 border border-outline-variant/40 backdrop-blur-2xl shadow-[0_24px_60px_rgba(18,7,9,0.95)]">
          {/* Mode Switcher Tabs (when in input step) */}
          {step === 'input' && (
            <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setDevOtpHint(null);
                }}
                className={`py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>Patron Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setDevOtpHint(null);
                }}
                className={`py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">stars</span>
                <span>Join Royalty</span>
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
                : 'Join the Royal Court'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {step === 'otp'
                ? `Enter the 6-digit seal dispatched to ${activeIdentifier}`
                : mode === 'login'
                ? 'Sign in to access your Digital Maharaja Card, stamps, and rewards'
                : 'Register your royal credentials to receive your Digital Maharaja Card'}
            </p>
          </div>

          {/* ── STEP 1: PATRON SIGN IN ───────────────────────────────────── */}
          {step === 'input' && mode === 'login' && (
            <div className="space-y-5">
              {/* Method Toggle: Email OTP vs Mobile OTP */}
              <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-surface-container-high/60 border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'email'
                      ? 'bg-surface-container-lowest text-primary shadow-sm border border-primary/30'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">alternate_email</span>
                  <span>Email OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'phone'
                      ? 'bg-surface-container-lowest text-primary shadow-sm border border-primary/30'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">phone_iphone</span>
                  <span>Mobile OTP</span>
                </button>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                {loginMethod === 'email' ? (
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
                ) : (
                  <div>
                    <label htmlFor="login-phone" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                      Patron Mobile Number
                    </label>
                    <div className="relative flex">
                      <div className="flex items-center px-3.5 bg-surface-container border border-r-0 border-outline-variant/40 rounded-l-xl text-xs text-secondary font-mono font-bold">
                        +91
                      </div>
                      <input
                        id="login-phone"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-r-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-mono tracking-wider"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
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

              {/* Quick Demo Fill Helper */}
              <div className="pt-4 border-t border-outline-variant/30">
                <p className="text-[11px] uppercase tracking-wider text-on-surface-variant/70 text-center font-semibold mb-2">
                  One-Click Demo Patrons
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('email');
                      setEmail('patron@urbanmaharaja.com');
                      toast.success('Loaded patron@urbanmaharaja.com');
                    }}
                    className="p-2 rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-primary font-mono text-center transition-colors cursor-pointer"
                  >
                    Email Patron
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('phone');
                      setPhone('9876543210');
                      toast.success('Loaded 9876543210 (Rahul Sharma)');
                    }}
                    className="p-2 rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-secondary font-mono text-center transition-colors cursor-pointer"
                  >
                    Mobile Patron
                  </button>
                </div>
              </div>
            </div>
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
                    placeholder="e.g. Maharani Gayatri Devi"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                    autoFocus
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
                  Mobile Number <span className="text-[10px] text-on-surface-variant/60 lowercase">(optional for SMS stamps)</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    phone
                  </span>
                  <input
                    id="reg-phone"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Royal Privilege Note */}
              <div className="p-3 rounded-xl bg-surface-container-high/60 border border-secondary/30 flex items-start gap-2.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  card_membership
                </span>
                <span>
                  Your active <strong className="text-secondary">Digital Maharaja Card</strong> will be automatically issued immediately upon email verification.
                </span>
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
                    <span>Change {loginMethod === 'email' || mode === 'register' ? 'Email' : 'Number'}</span>
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

          {/* Links Back & Staff Switch */}
          <div className="mt-7 pt-5 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant/70">
            <Link
              to="/admin/login"
              className="hover:text-primary transition-colors no-underline flex items-center gap-1 font-medium"
            >
              <span>Staff &amp; Concierge</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
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
