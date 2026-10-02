import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, X, UtensilsCrossed, ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if welcome was already dismissed this session
    const dismissed = sessionStorage.getItem('um_welcome_dismissed');
    if (!dismissed) {
      // Small gentle delay for smooth initial render
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('um_welcome_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-heading"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-[#e0c8b0] shadow-[0_25px_60px_-15px_rgba(46,26,16,0.35)] p-6 sm:p-8 text-on-surface overflow-hidden z-10"
          >
            {/* Ambient Background Aura */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#fdfaf6] hover:bg-[#f3e7dc] border border-[#ede0d2] text-[#483328] hover:text-[#1d0f09] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close welcome message"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emblem */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary via-amber-400 to-secondary shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Urban Maharaja Logo"
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-2.5">
                <UtensilsCrossed className="w-3 h-3" />
                <span>Fine Dine &amp; Rewards</span>
              </div>

              {/* Heading */}
              <h2 id="welcome-heading" className="font-serif text-2xl sm:text-3xl font-black text-[#1d0f09] tracking-tight mb-2">
                Welcome to Urban Maharaja
              </h2>

              {/* Tagline */}
              <p className="font-serif text-sm sm:text-base italic text-secondary font-semibold mb-3">
                “Good food, good company, and a place to enjoy it all.”
              </p>

              {/* Body */}
              <p className="text-xs sm:text-sm text-[#2d1a10] leading-relaxed max-w-md mb-4 font-medium">
                Urban Maharaja welcomes you to enjoy comforting flavours, from Indian favourites and tandoori dishes to snacks, beverages and more.
              </p>

              {/* Location Badge */}
              <div className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#ede0d2] flex items-center justify-center gap-2 text-xs text-[#1d0f09] font-semibold mb-5 shadow-xs">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>AC-209, Central Spine, Gyan Vihar Marg, Jagatpura, Jaipur</span>
              </div>

              {/* Digital Rewards Promo Callout */}
              <div className="w-full p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-left mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1d0f09]">Your Visits. Your Rewards.</p>
                  <p className="text-[11px] text-[#483328] leading-tight">
                    Collect digital stamps on every visit to unlock complimentary delights!
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleClose}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary text-white text-xs sm:text-sm uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Enter Restaurant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/loyalty"
                  onClick={handleClose}
                  className="w-full py-3.5 px-5 rounded-full bg-[#fdfaf6] hover:bg-[#f5ede3] border border-[#e0c8b0] text-[#1d0f09] text-xs sm:text-sm uppercase tracking-wider font-bold transition-all text-center no-underline"
                >
                  Explore Rewards
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
