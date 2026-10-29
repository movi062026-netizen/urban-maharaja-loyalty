import { useState } from 'react';
import useSeo from '../../hooks/useSeo';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  useSeo({ title: "Join the Maharaja Card", description: "Create your free Urban Maharaja digital loyalty card.", noindex: true });
  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Register new patron account ("Join Royalty")
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || name.trim().length < 2) {
      toast.error('Please enter your full noble name (at least 2 characters)');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Please enter a valid royal email address');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.registerCustomer({
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password,
      });

      login(data.data.user, data.data.tokens);
      toast.success(`Welcome to the Court of Urban Maharaja, ${data.data.user.name || 'Noble Patron'}!`);
      navigate('/guest/card');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Sign In
  const handleGoogleSignIn = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Use Google Identity Services OAuth2 token client
    if (window.google?.accounts?.oauth2 && googleClientId) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              await submitGoogleToken(tokenResponse.access_token);
            }
          },
        });
        tokenClient.requestAccessToken();
        return;
      } catch (err) {
        // Fallback
      }
    }

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

    // Direct Google prompt fallback for dev
    const promptEmail = window.prompt(
      'Enter Google email to continue via Google OAuth:',
      email || 'patron@gmail.com'
    );
    if (!promptEmail) return;

    submitGoogleToken(`mock_google_token_${promptEmail.trim().toLowerCase()}`);
  };

  const submitGoogleToken = async (idToken) => {
    setLoading(true);
    try {
      const { data } = await authApi.googleLogin(idToken);
      login(data.data.user, data.data.tokens);
      toast.success(data.message || `Welcome, ${data.data.user.name}!`);
      navigate('/guest/card');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

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
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                ★
              </div>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl uppercase tracking-[0.2em] text-primary font-bold">
              URBAN MAHARAJA
            </h1>
            <p className="text-xs uppercase tracking-[0.26em] text-secondary font-semibold mt-1">
              JOIN ROYAL PATRONAGE
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card-royal p-5 sm:p-7 lg:p-9">
          {/* Header Title */}
          <div className="mb-6">
            <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
              Create Patron Account
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Enroll in the Royal Loyalty Circle to earn complimentary dining, bespoke gifts, and exclusive privileges.
            </p>
          </div>

          {/* ── REGISTRATION FORM ─────────────────────────────────────────── */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                Noble Name
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
                  placeholder="Maharaja Vikramaditya"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  autoComplete="name"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="reg-email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
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
                  placeholder="patron@urbanmaharaja.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Mobile Phone Number */}
            <div>
              <label htmlFor="reg-phone" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                Mobile Number (For Royal Stamp Concierge)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                  phone_iphone
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Secret Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                Secret Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                  lock
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password (min 8 characters)"
                  className="w-full pl-11 pr-11 py-3.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enroll in Royal Court</span>
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                </>
              )}
            </button>

            {/* Social Google Login */}
            <div className="mt-6">
              <div className="mb-5 flex items-center gap-3" role="separator" aria-label="or sign up with Google">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-outline-variant/60" />
                <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap">
                  or sign up with
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-outline-variant/60" />
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
                <span>Join with Google</span>
              </button>
            </div>

            {/* Login Redirect */}
            <div className="text-center pt-3">
              <p className="text-xs text-on-surface-variant">
                Already a Noble Patron?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-bold transition-colors ml-1"
                >
                  Enter Court &rarr;
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
