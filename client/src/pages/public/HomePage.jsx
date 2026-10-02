import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MaharajaCard from '../../components/loyalty/MaharajaCard';
import toast from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const [bookingTime, setBookingTime] = useState('Tonight, 7:30 PM');
  const [partySize, setPartySize] = useState('2 Royalty');
  const [seating, setSeating] = useState('Main Pavilion');

  const handleQuickReservation = (e) => {
    e.preventDefault();
    toast.success(`Royal table reserved for ${partySize} in ${seating} (${bookingTime})!`);
    navigate('/contact');
  };

  return (
    <article className="w-full max-w-full bg-background min-h-screen text-on-surface overflow-x-hidden">
      {/* ── 1. HERO GRAND ENTRY ───────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-full pt-8 sm:pt-12 pb-16 sm:pb-20 md:py-24 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low" aria-label="Hero"
      >
        {/* Ambient glowing orbs & regal rosewood aura */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[550px] bg-primary-container/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] max-w-full h-[400px] bg-tertiary-container/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-10 right-1/4 w-[500px] max-w-full h-[350px] bg-secondary-container/25 rounded-full blur-[110px]" />
        </div>

        {/* Scalloped Palace Jharokha Arch Backdrop Silhouette in Rose Gold */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none overflow-hidden">
          <svg className="w-full max-w-5xl h-auto" fill="none" viewBox="0 0 800 650" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M400 30 C 470 120, 560 170, 680 190 C 760 210, 780 280, 780 370 L 780 650 L 20 650 L 20 370 C 20 280, 40 210, 120 190 C 240 170, 330 120, 400 30 Z"
              stroke="#de6b90"
              strokeWidth="2.5"
            />
            <path
              d="M400 70 C 455 145, 530 185, 640 205 C 710 220, 730 280, 730 360 L 730 630 L 70 630 L 70 360 C 70 280, 90 220, 160 205 C 270 185, 345 145, 400 70 Z"
              stroke="#e4c194"
              strokeDasharray="8 6"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-12 flex flex-col items-center text-center">
          {/* Regal Crest Artwork Emblem */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 120 }}
            className="relative group cursor-pointer mb-6 transition-all duration-700 hover:scale-105"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary-container/40 via-secondary/30 to-primary-container/40 blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-2 rounded-3xl bg-surface-container-high/90 backdrop-blur-xl border border-primary/40 shadow-[0_20px_45px_-10px_rgba(160,58,94,0.15),0_0_30px_rgba(222,107,144,0.1)] flex items-center justify-center">
              <img
                alt="Urban Maharaja Logo"
                className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl drop-shadow-[0_8px_16px_rgba(46,26,20,0.15)]"
                src="/logo.png"
              />
            </div>
          </motion.div>

          {/* Royal Distinction Pill */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-surface-container/80 backdrop-blur-md border border-primary/30 shadow-md mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
              Good Food & Good Company
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold">
              Jagatpura, Jaipur
            </span>
          </motion.div>

          {/* Stately Hero Headline */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface max-w-4xl tracking-tight leading-[1.2] sm:leading-[1.25] mb-5 sm:mb-6 font-bold"
          >
            Where Royalty Meets
            <span className="block mt-2 sm:mt-3 italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal drop-shadow-[0_2px_14px_rgba(222,107,144,0.3)]">
              Comforting Flavours
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="font-sans text-sm sm:text-base lg:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2 sm:px-4"
          >
            Good food, good company, and a place to enjoy it all. Enjoy comforting Indian favourites, tandoori dishes, snacks, beverages, and rewarding dining in Jagatpura, Jaipur.
          </motion.p>

          {/* Dual Luxury Call-to-Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-10 sm:mb-14 w-full"
          >
            <Link
              to="/loyalty"
              className="relative group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full glass-btn-primary text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.14em] sm:tracking-[0.16em] shadow-[0_12px_28px_rgba(222,107,144,0.35)] hover:shadow-[0_16px_36px_rgba(255,177,198,0.5)] hover:scale-105 transition-all duration-300 no-underline w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
              <span>Explore Maharaja Card</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full glass-btn-secondary text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-all duration-300 no-underline w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">restaurant_menu</span>
              <span>View Royal Menu</span>
            </Link>
          </motion.div>

          {/* Accolade Ribbon Strip with Rose-Gold Frosted Finish */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl glass-surface text-left">
              <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px] shrink-0" aria-hidden="true">workspace_premium</span>
              <div>
                <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-secondary font-semibold mb-0.5">Honor</p>
                <p className="text-sm sm:text-base font-serif font-bold text-on-surface leading-snug">Michelin Guide 2025</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl glass-surface text-left">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0">stars</span>
              <div>
                <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-secondary font-semibold mb-0.5">Gastronomy</p>
                <p className="text-base font-serif font-bold text-on-surface leading-snug">Best Indian Fine Dine</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl glass-surface text-left">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0">local_fire_department</span>
              <div>
                <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-secondary font-semibold mb-0.5">Lineage</p>
                <p className="text-base font-serif font-bold text-on-surface leading-snug">Royal Khansama Recipes</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 2. THE IMPERIAL PHILOSOPHY & HERITAGE HIGHLIGHT ───────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-full py-20 md:py-28 bg-surface-container-lowest overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Tag */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-secondary font-semibold mb-2">
              Artisan Provenance
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-on-surface font-bold">
              The Secrets of the Royal Dastarkhān
            </h2>
            <div className="w-16 h-0.5 bg-primary-container mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Rich Imagery & Arch Motif Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden border border-outline-variant/40 shadow-[0_24px_50px_rgba(46,26,20,0.12)] bg-surface-container-high">
                <img
                  className="w-full h-80 sm:h-96 md:h-[440px] object-cover hover:scale-105 transition-transform duration-700"
                  alt="Opulent Indian royal banquet interior"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjMbhiRMTT50iVHzPfrPutfPir8iivE4lyQtLSBBLiw0nR7PAK6EDWoBHH6Jc4r4ONIQHPzTS_ZiZev5dnNW_UDBZl0c75VWRDpHMRtB6Pw6YOqnwvFFcpsVHcKjf0L_5i_br2fXwTkeJTIK8VUoDMAulPYQmMslFwQh9XdT3sKuLJ1k22Ate_OQJLjc3bVCbaZpIU6jGzFUstF07pcUAGQoId3UYHJfciRfX9wVBj"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-surface-container/90 border border-primary/20 backdrop-blur-lg shadow-lg">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold block mb-1">
                    Jaipur Heritage Archives • Folio 41
                  </span>
                  <p className="font-serif text-base sm:text-lg text-on-surface italic leading-snug">
                    “Food must comfort the soul before it seduces the palate.”
                  </p>
                </div>
              </div>

              {/* Secondary floating mini-card */}
              <div className="hidden sm:flex absolute -bottom-5 -right-5 z-20 items-center gap-4 p-5 rounded-2xl bg-surface-container-high/95 border border-primary/30 backdrop-blur-xl shadow-[0_16px_36px_rgba(46,26,20,0.1)]">
                <div className="w-12 h-12 rounded-xl bg-primary-container/25 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[26px]">hourglass_bottom</span>
                </div>
                <div>
                  <p className="text-xl font-serif font-bold text-primary">14 Hours</p>
                  <p className="text-xs text-on-surface-variant font-sans">Continuous slow-braise charcoal dum</p>
                </div>
              </div>
            </div>

            {/* Right: Story Narrative & Royal Pillars */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold block mb-2">
                  The Custodians of Royal Flavours
                </span>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface leading-snug font-bold mb-4">
                  Resurrecting the Lost Feasts of Rajputana &amp; Awadh Courtyards
                </h3>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6 font-sans">
                  At Urban Maharaja, we retrace the fragrant footsteps of historic royal kitchens. Every masala blend is hand-pounded in stone mortars using wild Himalayan herbs, rare Kashmiri saffron, and cold-pressed edible oils, honoring traditions untouched by industrial hurry.
                </p>
              </div>

              {/* 3 Heritage Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl glass-surface transition-all hover:border-primary/40">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/25 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">skillet</span>
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-on-surface mb-1">Dhungar Smoked &amp; Claypot Dum</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Vessels are traditionally sealed with dough and buried in gentle wood embers to trap aroma and moisture.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl glass-surface transition-all hover:border-secondary/40">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">award_star</span>
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-on-surface mb-1">24 Karat Pure Edible Vark</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Rare heritage banquets are crowned with hand-hammered edible gold and silver leaf, evoking the Nawabi courts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl glass-surface transition-all hover:border-primary/40">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/25 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-on-surface mb-1">Secret Heirloom Khansama Manuscripts</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Our Executive Master Chef preserves century-old culinary parchments entrusted by fourth-generation royal cooks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary hover:text-primary-fixed transition-colors no-underline font-bold"
                >
                  <span>Read Full Heritage Folio</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 3. THE MAHARAJA LOYALTY CARD TEASER ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-full py-20 md:py-28 bg-gradient-to-b from-surface to-surface-container-lowest overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/40 border border-secondary/30 text-secondary mb-3">
              <span className="material-symbols-outlined text-[16px]">loyalty</span>
              <span className="text-xs uppercase tracking-[0.22em] font-semibold">Rewards Program</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-on-surface font-bold mb-4">Your Visits. Your Rewards.</h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans">
              Every time you visit Urban Maharaja, you have the opportunity to collect rewards. Join our rewards program, keep track of your visits, and enjoy something extra the next time you dine with us.
            </p>
          </div>

          {/* 3-Step Journey Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Step 1 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">grade</span>
                  </div>
                  <span className="font-serif text-3xl font-bold text-primary/30">01</span>
                </div>
                <h3 className="font-serif text-xl text-on-surface font-bold mb-2">Visit &amp; Dine</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
                  Immerse yourself in our imperial dining room. Savor our curated tasting degustation or a la carte specialties.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center text-primary text-xs uppercase tracking-[0.2em] font-bold">
                <span>1 Visit = 1 Royal Seal</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-secondary/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                  </div>
                  <span className="font-serif text-3xl font-bold text-secondary/30">02</span>
                </div>
                <h3 className="font-serif text-xl text-on-surface font-bold mb-2">Collect Stamps</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
                  Scan your bespoke table QR code or display your digital Maharaja pass. Staff immediately verifies your royal stamp.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center text-secondary text-xs uppercase tracking-[0.2em] font-bold">
                <span>Instant Digital Ledger</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/25 border border-primary/30 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">redeem</span>
                  </div>
                  <span className="font-serif text-3xl font-bold text-primary/30">03</span>
                </div>
                <h3 className="font-serif text-xl text-on-surface font-bold mb-2">Unlock Rewards</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
                  Surrender collected stamps for aged single-malt pairings, reserve private Jharokha booths, or regal tasting flights.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center text-primary text-xs uppercase tracking-[0.2em] font-bold">
                <span>Lifetime Sovereign Privileges</span>
              </div>
            </div>
          </div>

          {/* Interactive Maharaja Metallic Card Showcase & Tier Preview */}
          <div className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-surface-container-high/70 border border-outline-variant/40 backdrop-blur-2xl shadow-[0_24px_50px_rgba(46,26,20,0.08)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Virtual Glassmorphic Card Graphic */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <MaharajaCard
                  guestName="Ravi Prakash Singh"
                  currentStamps={3}
                  targetStamps={5}
                  cycleNumber={1}
                />
              </div>

              {/* Tier Specifications & Quick CTA */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold block mb-1">
                    Member Milestones
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold mb-2">
                    Rewards That Grow With Your Visits
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Enjoy complimentary treats, special dining perks, and thoughtful rewards as you dine and collect stamps with us.
                  </p>
                </div>

                {/* Tier Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-surface-container/70 border border-outline-variant/30 text-center">
                    <p className="text-[10px] uppercase text-outline tracking-widest font-semibold">Tier 1</p>
                    <p className="font-serif text-base text-on-surface font-bold mt-0.5">Emerald</p>
                    <p className="text-xs text-on-surface-variant">3 Stamps</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container/70 border border-secondary/30 text-center">
                    <p className="text-[10px] uppercase text-secondary tracking-widest font-semibold">Tier 2</p>
                    <p className="font-serif text-base text-secondary font-bold mt-0.5">Ruby</p>
                    <p className="text-xs text-on-surface-variant">7 Stamps</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container/80 border border-primary/50 text-center bg-primary-container/15">
                    <p className="text-[10px] uppercase text-primary tracking-widest font-semibold">Supreme</p>
                    <p className="font-serif text-base text-primary font-bold mt-0.5">Kohinoor</p>
                    <p className="text-xs text-on-surface-variant">12+ Stamps</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/loyalty"
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white text-xs uppercase tracking-[0.16em] font-bold hover:brightness-110 transition-all shadow-md no-underline"
                  >
                    Claim Digital Card
                  </Link>
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-[0.16em] text-on-surface-variant hover:text-primary transition-colors no-underline font-semibold"
                  >
                    Cardholder Sign In →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 4. CHEF'S TASTING FLIGHT & SIGNATURE CREATIONS ────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-full py-20 md:py-28 bg-surface-container-low overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-secondary font-semibold block mb-1">
                Culinary Masterpieces
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-on-surface font-bold">
                The Royal Degustation Highlights
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary hover:text-primary-fixed transition-colors no-underline font-bold"
            >
              <span>Explore Entire Royal Carte</span>
              <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
            </Link>
          </div>

          {/* 4 Authentic Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dish 1: Haryali Paneer Tikka */}
            <div className="group rounded-3xl overflow-hidden bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Haryali Paneer Tikka Sizzler"
                    src="/dishes/dish-paneer-tikka-premium.jpg"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md border border-primary/30">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold">
                      Chef's Special
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3 font-serif text-xl text-primary font-bold drop-shadow-md">
                    ₹320
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-secondary mb-1">
                    <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-white shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Tandoori Sizzler</span>
                  </div>
                  <h3 className="font-serif text-lg text-on-surface font-bold mb-1.5 group-hover:text-primary transition-colors">
                    Haryali Paneer Tikka
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    Fresh cottage cheese cubes steeped in wild mountain herbs, roasted spices, and slow-grilled in our clay tandoor with bell peppers &amp; onions.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant font-sans">
                  Char-Grilled In Tandoor
                </span>
                <Link
                  to="/menu"
                  className="text-xs font-semibold text-primary hover:text-primary-fixed flex items-center gap-1 no-underline transition-colors"
                >
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                </Link>
              </div>
            </div>

            {/* Dish 2: Cheesy Garlic Herb Bruschetta */}
            <div className="group rounded-3xl overflow-hidden bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-secondary/50 flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Cheesy Garlic Herb Bruschetta"
                    src="/dishes/dish-bruschetta-premium.jpg"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md border border-secondary/30">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-secondary font-bold">
                      Gourmet Starter
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3 font-serif text-xl text-primary font-bold drop-shadow-md">
                    ₹240
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-secondary mb-1">
                    <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-white shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Artisan Starter</span>
                  </div>
                  <h3 className="font-serif text-lg text-on-surface font-bold mb-1.5 group-hover:text-secondary transition-colors">
                    Cheesy Herb Bruschetta
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    Crusty sourdough baguettes toasted with garlic-infused butter, roasted olives, bubbling mozzarella, and served with spiced house marinara.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant font-sans">
                  Wood-Fired Toasting
                </span>
                <Link
                  to="/menu"
                  className="text-xs font-semibold text-secondary hover:text-secondary-fixed flex items-center gap-1 no-underline transition-colors"
                >
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                </Link>
              </div>
            </div>

            {/* Dish 3: Royal Maharaja Masala Dosa */}
            <div className="group rounded-3xl overflow-hidden bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Royal Maharaja Masala Dosa"
                    src="/dishes/dish-royal-dosa-premium.jpg"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md border border-primary/30">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold">
                      Royal Feast
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3 font-serif text-xl text-primary font-bold drop-shadow-md">
                    ₹210
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-secondary mb-1">
                    <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-white shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Imperial Delicacy</span>
                  </div>
                  <h3 className="font-serif text-lg text-on-surface font-bold mb-1.5 group-hover:text-primary transition-colors">
                    Royal Maharaja Dosa
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    Paper-thin crispy crepe roasted with clarified butter, filled with spiced masala, served with aromatic lentil sambar, fresh coconut chutney &amp; cottage cheese.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant font-sans">
                  Sambar &amp; Chutney Flight
                </span>
                <Link
                  to="/menu"
                  className="text-xs font-semibold text-primary hover:text-primary-fixed flex items-center gap-1 no-underline transition-colors"
                >
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                </Link>
              </div>
            </div>

            {/* Dish 4: Artisan Grilled Club Sandwich */}
            <div className="group rounded-3xl overflow-hidden bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-secondary/50 flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Artisan Grilled Club Sandwich"
                    src="/dishes/dish-grilled-sandwich-premium.jpg"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md border border-secondary/30">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-secondary font-bold">
                      Royal Platter
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3 font-serif text-xl text-primary font-bold drop-shadow-md">
                    ₹220
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-secondary mb-1">
                    <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-white shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Special Sandwich</span>
                  </div>
                  <h3 className="font-serif text-lg text-on-surface font-bold mb-1.5 group-hover:text-secondary transition-colors">
                    Artisan Club Sandwich
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    Multi-tier golden-brown grilled bread packed with shredded farm vegetables, spiced house spread, melted cheese, and fresh garden salad garnish.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant font-sans">
                  Gourmet Salad &amp; Dip
                </span>
                <Link
                  to="/menu"
                  className="text-xs font-semibold text-secondary hover:text-secondary-fixed flex items-center gap-1 no-underline transition-colors"
                >
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 5. CRITICS' ENCOMIUM & PALACE RESERVATION CONCIERGE ────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-full py-20 md:py-28 bg-surface overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Gastronome Endorsement Card */}
          <div className="mb-16 p-8 sm:p-12 lg:p-14 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl shadow-xl text-center relative overflow-hidden">
            <span className="material-symbols-outlined text-primary text-[42px] opacity-40 mb-3 inline-block">
              format_quote
            </span>
            <blockquote className="font-serif text-lg sm:text-2xl md:text-3xl text-on-surface max-w-3xl mx-auto leading-relaxed mb-6 italic">
              “Urban Maharaja is not merely dining; it is an exalted voyage into the opulent banquets of Rajasthan’s sovereign princes. Every bite is poetry, smoke, and gold.”
            </blockquote>
            <div className="flex flex-col items-center">
              <p className="text-base font-serif text-primary font-bold">Antoine de Saint-Germain</p>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold mt-0.5">
                Grand Gastronomie Gazette Paris
              </p>
            </div>
          </div>

          {/* Palace Table Reservation Bar */}
          <div className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-r from-surface-container-lowest via-surface-container-high to-surface-container-lowest border border-outline-variant/40 shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-md text-center lg:text-left">
                <span className="text-xs uppercase tracking-[0.22em] text-primary font-bold block mb-1">
                  The Sovereign Table
                </span>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold">
                  Reserve Your Imperial Seat
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Evening degustations are strictly limited to twenty-four patrons to guarantee intimate master-chef service.
                </p>
              </div>

              {/* Quick Interactive Booking Bar */}
              <form onSubmit={handleQuickReservation} className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                  <input
                    className="bg-transparent text-xs text-on-surface focus:outline-none w-full cursor-pointer font-sans"
                    type="text"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>

                <div className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                  <select
                    className="bg-transparent text-xs text-on-surface focus:outline-none w-full cursor-pointer font-sans"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                  >
                    <option className="bg-surface-container text-on-surface" value="2 Royalty">2 Royalty</option>
                    <option className="bg-surface-container text-on-surface" value="4 Royalty">4 Royalty</option>
                    <option className="bg-surface-container text-on-surface" value="6+ Banquet">6+ Banquet</option>
                  </select>
                </div>

                <div className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">chair</span>
                  <select
                    className="bg-transparent text-xs text-on-surface focus:outline-none w-full cursor-pointer font-sans"
                    value={seating}
                    onChange={(e) => setSeating(e.target.value)}
                  >
                    <option className="bg-surface-container text-on-surface" value="Main Pavilion">Main Pavilion</option>
                    <option className="bg-surface-container text-on-surface" value="Jharokha Alcove">Jharokha Alcove</option>
                    <option className="bg-surface-container text-on-surface" value="Chef's Table">Chef's Table</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-container to-secondary hover:brightness-110 text-white text-xs uppercase tracking-[0.16em] font-bold shadow-md transition-all cursor-pointer"
                >
                  Confirm Seat
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>
    </article>
  );
}
