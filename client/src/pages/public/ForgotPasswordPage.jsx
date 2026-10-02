import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState(null);

  // Resend Countdown Timer
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef([]);
  const navigate = useNavigate();

  // Timer effect for resend countdown
  useEffect(() => {
    let interval = null;
    if (step === 'reset' && resendTimer > 0) {
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

  // Focus first OTP input when step changes to 'reset'
  useEffect(() => {
    if (step === 'reset' && otpInputsRef.current[0]) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Step 1: Request Password Reset Seal via Resend
  const handleRequestReset = async (e) => {
    if (e) e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      toast.error('Please enter a valid royal email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword(cleanEmail);
      toast.success(
        data.message || 'Royal verification seal dispatched to your email via Resend!'
      );
      if (data.data?.devOtp) {
        setDevOtpHint(data.data.devOtp);
      }
      setResendTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setStep('reset');
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || 'Failed to dispatch password reset seal'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP input changes
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...otpDigits];

    if (cleanVal.length <= 1) {
      newDigits[index] = cleanVal;
      setOtpDigits(newDigits);

      if (cleanVal && index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }
    } else {
      // Handle paste
      const pasteChars = cleanVal.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasteChars[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasteChars.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 2: Submit Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const otp = otpDigits.join('');

    if (otp.length < 6) {
      toast.error('Please enter the complete 6-digit verification seal');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('The secret passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.resetPassword({
        email: cleanEmail,
        otp,
        newPassword,
      });

      toast.success(data.message || 'Royal password updated successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || 'Failed to reset password. Please check your verification seal.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh flex items-center justify-center bg-background px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden text-on-surface">
      {/* Ambient background glow accents */}
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
              <span className="material-symbols-outlined text-primary text-[36px]">lock_reset</span>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                ★
              </div>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl uppercase tracking-[0.2em] text-primary font-bold">
              URBAN MAHARAJA
            </h1>
            <p className="text-xs uppercase tracking-[0.26em] text-secondary font-semibold mt-1">
              ROYAL CREDENTIAL RECOVERY
            </p>
          </Link>
        </div>

        {/* Recovery Card */}
        <div className="glass-card-royal p-5 sm:p-7 lg:p-9">
          {/* Header Title */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-2">
              <span className="material-symbols-outlined text-[13px]">mark_email_read</span>
              <span>Resend Verification Seal</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
              {step === 'request' ? 'Recover Passkey' : 'Set New Secret Password'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {step === 'request'
                ? 'Enter your registered email address to receive an imperial password reset seal via Resend.'
                : `Enter the 6-digit seal dispatched to ${email} and establish your new secret passkey.`}
            </p>
          </div>

          {/* Dev OTP Hint Notice */}
          {devOtpHint && (
            <div className="mb-4 p-3 rounded-xl bg-secondary/15 border border-secondary/40 text-secondary text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Dev Reset Seal: <strong>{devOtpHint}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const chars = String(devOtpHint).split('');
                  setOtpDigits(chars);
                  toast.success('Pasted dev reset seal!');
                }}
                className="text-[11px] font-bold underline cursor-pointer text-secondary hover:brightness-125"
              >
                Auto Fill
              </button>
            </div>
          )}

          {/* ── STEP 1: REQUEST RESET SEAL ──────────────────────────────── */}
          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label
                  htmlFor="recovery-email"
                  className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    alternate_email
                  </span>
                  <input
                    id="recovery-email"
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
                    <span>Dispatch Reset Seal via Resend</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors flex items-center gap-1 no-underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                  <span>Back to Patron Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="text-secondary hover:underline transition-colors font-semibold"
                >
                  Create New Account
                </Link>
              </div>
            </form>
          )}

          {/* ── STEP 2: VERIFY SEAL & SET NEW PASSWORD ───────────────────── */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Target Email Banner */}
              <div className="p-3 rounded-xl bg-surface-container-high/80 border border-outline-variant/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                    mail
                  </span>
                  <span className="truncate font-mono text-on-surface">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-secondary text-[11px] uppercase tracking-wider font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* 6-Digit OTP Input Boxes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                  6-Digit Verification Seal
                </label>
                <div className="flex gap-2 sm:gap-2.5 justify-between">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 sm:w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border transition-all focus:outline-none ${
                        digit
                          ? 'border-primary bg-primary-container/20 text-primary shadow-[0_0_12px_rgba(222,107,144,0.3)]'
                          : 'border-outline-variant/40 bg-surface-container text-on-surface focus:border-primary'
                      }`}
                      autoComplete="one-time-code"
                      required
                    />
                  ))}
                </div>
              </div>

              {/* Resend Seal Action */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-on-surface-variant/80">
                  Didn't receive the seal?
                </span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleRequestReset}
                    disabled={loading}
                    className="text-primary font-bold hover:underline uppercase tracking-wider text-[11px] cursor-pointer"
                  >
                    Resend Seal
                  </button>
                ) : (
                  <span className="text-on-surface-variant/60 font-mono text-[11px]">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>

              {/* New Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="reset-new-password"
                    className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold"
                  >
                    New Secret Password
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
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2"
                >
                  Confirm New Secret Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    check_circle
                  </span>
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your secret password"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-error mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    <span>Passwords do not match</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (confirmPassword && newPassword !== confirmPassword)}
                className="w-full py-4 rounded-xl glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update Secret Passkey</span>
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-outline-variant/30 text-center">
                <Link
                  to="/login"
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 no-underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                  <span>Return to Patron Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Portal Switching Footers */}
        <div className="mt-6 text-center text-xs text-on-surface-variant/80 space-y-2">
          <p>
            Staff terminal credentials recovery?{' '}
            <Link to="/staff/login" className="text-secondary hover:underline font-semibold">
              Concierge Portal
            </Link>
          </p>
          <p>
            Administrative authority access?{' '}
            <Link to="/admin/login" className="text-primary hover:underline font-semibold">
              Executive Console
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
