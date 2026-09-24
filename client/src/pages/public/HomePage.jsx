import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* ── 1. HERO GRAND ENTRY ───────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-24 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low">
        {/* Ambient glowing orbs & regal rosewood aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-tertiary-container/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-[500px] h-[350px] bg-secondary-container/25 rounded-full blur-[110px] pointer-events-none" />

        {/* Scalloped Palace Jharokha Arch Backdrop Silhouette in Rose Gold */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
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

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          {/* Regal Crest Artwork Emblem */}
          <div className="relative group cursor-pointer mb-6 transition-all duration-700 hover:scale-105">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary-container/40 via-secondary/30 to-primary-container/40 blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-2 rounded-3xl bg-surface-container-high/90 backdrop-blur-xl border border-primary/40 shadow-[0_20px_45px_-10px_rgba(24,10,12,0.95),0_0_30px_rgba(222,107,144,0.3)] flex items-center justify-center">
              <img
                alt="Urban Maharaja Logo"
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsWqtkieOSn8K5iK0iO5qYJhpc58Wot5yv4gJ07LgSqa7agNcLQ-kiGVgGTifWV-01iZdv1bxmUhdF99lNYzbcK6oyRpedJZxI8rDclE1JY_rZVo6UdizRjSYMioskVsr6ZZFEslg_mpCL0_SVEzgGREnvTiCB6uNkWQSVvsCLh-RspcJWWp6TiP1s-tfTmlXKRVDicQlVKGMP6G463JBVYUlMit_iPPFHFAlaCgTAqQy3ClGC_wURgA"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          </div>

          {/* Royal Distinction Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md border border-primary/30 shadow-[0_4px_16px_rgba(0,0,0,0.5)] mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-primary">
              Imperial Dining Sanctuary
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
              Est. 1928
            </span>
          </div>

          {/* Stately Hero Headline */}
          <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight mb-6">
            Where Royalty Meets <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal drop-shadow-[0_2px_14px_rgba(222,107,144,0.3)]">
              Culinary Excellence
            </span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-10">
            Dine like a Maharaja and immerse in centuries of regal Indian heritage, slow-cooked royal repasts, 24-karat saffron delicacies, and transcendent palace hospitality.
          </p>

          {/* Dual Luxury Call-to-Actions */}
          <div className="flex flex-wrap items-center justify-center gap-5 mb-16">
            <Link
              to="/loyalty"
              className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-label-lg text-label-lg uppercase tracking-[0.16em] font-bold shadow-[0_12px_28px_rgba(222,107,144,0.35)] hover:shadow-[0_16px_36px_rgba(255,177,198,0.5)] hover:scale-105 transition-all duration-300 no-underline"
            >
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
              <span>Explore Maharaja Card</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              to="/menu"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-surface-container-high/70 hover:bg-surface-container-highest text-on-surface hover:text-primary font-label-lg text-label-lg uppercase tracking-[0.16em] border border-outline-variant/50 backdrop-blur-xl shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 no-underline"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">restaurant_menu</span>
              <span>View Royal Menu</span>
            </Link>
          </div>

          {/* Accolade Ribbon Strip with Rose-Gold Frosted Finish */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-surface-container/60 border border-primary/20 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
              <span className="material-symbols-outlined text-primary text-[22px]">workspace_premium</span>
              <div className="text-left">
                <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">Honor</p>
                <p className="font-title-md text-title-md text-on-surface">Michelin Guide 2025</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-surface-container/60 border border-primary/20 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
              <span className="material-symbols-outlined text-primary text-[22px]">stars</span>
              <div className="text-left">
                <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">Gastronomy</p>
                <p className="font-title-md text-title-md text-on-surface">Best Indian Fine Dine</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-surface-container/60 border border-primary/20 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
              <span className="material-symbols-outlined text-primary text-[22px]">local_fire_department</span>
              <div className="text-left">
                <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">Lineage</p>
                <p className="font-title-md text-title-md text-on-surface">Royal Khansama Recipes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THE IMPERIAL PHILOSOPHY & HERITAGE HIGHLIGHT ───────────── */}
      <section className="relative w-full py-24 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Section Tag */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-secondary mb-2">
              Artisan Provenance
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              The Secrets of the Royal Dastarkhān
            </h2>
            <div className="w-16 h-0.5 bg-primary-container mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Rich Imagery & Arch Motif Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden border border-outline-variant/40 shadow-[0_24px_50px_rgba(24,10,12,0.9)] bg-surface-container-high">
                <img
                  className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                  alt="Opulent Indian royal banquet interior"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjMbhiRMTT50iVHzPfrPutfPir8iivE4lyQtLSBBLiw0nR7PAK6EDWoBHH6Jc4r4ONIQHPzTS_ZiZev5dnNW_UDBZl0c75VWRDpHMRtB6Pw6YOqnwvFFcpsVHcKjf0L_5i_br2fXwTkeJTIK8VUoDMAulPYQmMslFwQh9XdT3sKuLJ1k22Ate_OQJLjc3bVCbaZpIU6jGzFUstF07pcUAGQoId3UYHJfciRfX9wVBj"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-surface-container/90 border border-primary/20 backdrop-blur-lg shadow-lg">
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-primary">
                    Jaipur Heritage Archives • Folio 41
                  </span>
                  <p className="font-headline-sm text-headline-sm text-on-surface italic mt-1">
                    “Food must comfort the soul before it seduces the palate.”
                  </p>
                </div>
              </div>

              {/* Secondary floating mini-card with rosewood glow */}
              <div className="hidden sm:flex absolute -bottom-6 -right-6 z-20 items-center gap-4 p-5 rounded-2xl bg-surface-container-high/95 border border-primary/30 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.7)]">
                <div className="w-12 h-12 rounded-xl bg-primary-container/25 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[26px]">hourglass_bottom</span>
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm text-primary font-bold">14 Hours</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Continuous slow-braise charcoal dum</p>
                </div>
              </div>
            </div>

            {/* Right: Story Narrative & Royal Pillars */}
            <div className="lg:col-span-6 flex flex-col space-y-8">
              <div className="space-y-4">
                <span className="font-label-lg text-label-lg uppercase tracking-[0.2em] text-primary">
                  The Custodians of Royal Flavours
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface leading-snug">
                  Resurrecting the Lost Feasts of Rajputana &amp; Awadh Courtyards
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  At Urban Maharaja, we retrace the fragrant footsteps of historic royal kitchens. Every masala blend is hand-pounded in stone mortars using wild Himalayan herbs, rare Kashmiri saffron, and cold-pressed edible oils, honoring traditions untouched by industrial hurry.
                </p>
              </div>

              {/* 3 Heritage Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30 backdrop-blur-md transition-all hover:bg-surface-container hover:border-primary/30">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/25 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">skillet</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface mb-1">Dhungar Smoked &amp; Claypot Dum</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Vessels are traditionally sealed with dough and buried in gentle wood embers to trap aroma and moisture.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30 backdrop-blur-md transition-all hover:bg-surface-container hover:border-secondary/30">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">award_star</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface mb-1">24 Karat Pure Edible Vark</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Rare heritage banquets are crowned with hand-hammered edible gold and silver leaf, evoking the Nawabi courts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30 backdrop-blur-md transition-all hover:bg-surface-container hover:border-primary/30">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/25 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface mb-1">Secret Heirloom Khansama Manuscripts</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Our Executive Master Chef preserves century-old culinary parchments entrusted by fourth-generation royal cooks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-[0.2em] text-primary hover:text-primary-fixed transition-colors no-underline font-semibold"
                >
                  <span>Read Full Heritage Folio</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THE MAHARAJA LOYALTY CARD TEASER ──────────────────────── */}
      <section className="relative w-full py-24 bg-gradient-to-b from-surface to-surface-container-lowest overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/40 border border-secondary/30 text-secondary mb-3">
              <span className="material-symbols-outlined text-[16px]">loyalty</span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.22em]">Imperial Loyalty Program</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Your Royal Journey</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Collect prestigious digital seals upon every royal repast. Ascend the sovereign tiers and unlock private salon access, complimentary chef pairings, and bespoke banquets.
            </p>
          </div>

          {/* 3-Step Journey Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-[0_16px_36px_-8px_rgba(24,10,12,0.8)] flex flex-col justify-between group hover:bg-surface-container-high hover:border-primary/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">grade</span>
                  </div>
                  <span className="font-display-lg text-headline-lg text-primary/30 font-bold">01</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Visit &amp; Dine</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Immerse yourself in our imperial dining room. Savor our curated tasting degustation or a la carte specialties.
                </p>
              </div>
              <div className="mt-6 pt-4 flex items-center text-primary font-label-sm text-label-sm uppercase tracking-[0.2em]">
                <span>1 Visit = 1 Royal Seal</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-[0_16px_36px_-8px_rgba(24,10,12,0.8)] flex flex-col justify-between group hover:bg-surface-container-high hover:border-secondary/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                  </div>
                  <span className="font-display-lg text-headline-lg text-secondary/30 font-bold">02</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Collect Stamps</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Scan your bespoke table QR code or display your digital Maharaja pass. Staff immediately verifies your royal stamp.
                </p>
              </div>
              <div className="mt-6 pt-4 flex items-center text-secondary font-label-sm text-label-sm uppercase tracking-[0.2em]">
                <span>Instant Digital Ledger</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-[0_16px_36px_-8px_rgba(24,10,12,0.8)] flex flex-col justify-between group hover:bg-surface-container-high hover:border-primary/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/25 border border-primary/30 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">redeem</span>
                  </div>
                  <span className="font-display-lg text-headline-lg text-primary/30 font-bold">03</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Unlock Rewards</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Surrender collected stamps for aged single-malt pairings, reserve private Jharokha booths, or regal tasting flights.
                </p>
              </div>
              <div className="mt-6 pt-4 flex items-center text-primary font-label-sm text-label-sm uppercase tracking-[0.2em]">
                <span>Lifetime Sovereign Privileges</span>
              </div>
            </div>
          </div>

          {/* Interactive Maharaja Metallic Card Showcase & Tier Preview */}
          <div className="rounded-3xl p-8 lg:p-12 bg-surface-container-high/70 border border-outline-variant/40 backdrop-blur-2xl shadow-[0_24px_50px_rgba(24,10,12,0.95)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Virtual Card Graphic with Rose Blush Trim & Emblem */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-[1.58/1] rounded-2xl p-6 bg-gradient-to-br from-surface-bright via-surface-container to-surface-container-lowest border border-primary-container/40 shadow-[0_20px_45px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-500 hover:scale-105">
                  {/* Radial sheen */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-container/25 rounded-full blur-2xl" />
                  <div className="relative h-full flex flex-col justify-between z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[28px]">crown</span>
                        <span className="font-headline-sm text-title-md text-primary font-bold tracking-widest uppercase">
                          Maharaja
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-primary-container/30 border border-primary/30 text-primary">
                        Kohinoor Tier
                      </span>
                    </div>

                    {/* Card Chip & Filigree */}
                    <div className="flex items-center gap-4 my-auto">
                      <div className="w-10 h-7 rounded bg-primary-container/40 border border-primary/50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface text-[18px]">contactless</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.18em]">
                          Imperial Member
                        </p>
                        <p className="font-title-md text-title-md text-on-surface font-mono tracking-wider">
                          RAVI PRAKASH SINGH
                        </p>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary">EXP 12/28</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Specifications & Quick CTA */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                <div>
                  <span className="font-label-lg text-label-lg uppercase tracking-[0.2em] text-secondary">
                    Ascend the Imperial Hierarchy
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                    From Emerald Guest to Kohinoor Patron
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                    Gain complimentary vintage champagnes, customized menus crafted by Chef in your honor, and priority seating without reservation waiting windows.
                  </p>
                </div>

                {/* Tier Chips */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-surface-container/70 border border-outline-variant/30 text-center">
                    <p className="font-label-sm text-label-sm uppercase text-outline tracking-widest">Tier 1</p>
                    <p className="font-title-md text-title-md text-on-surface font-bold">Emerald</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">3 Stamps</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container/70 border border-secondary/30 text-center">
                    <p className="font-label-sm text-label-sm uppercase text-secondary tracking-widest">Tier 2</p>
                    <p className="font-title-md text-title-md text-secondary font-bold">Ruby</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">7 Stamps</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container/80 border border-primary/50 text-center bg-primary-container/15">
                    <p className="font-label-sm text-label-sm uppercase text-primary tracking-widest">Supreme</p>
                    <p className="font-title-md text-title-md text-primary font-bold">Kohinoor</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">12+ Stamps</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Link
                    to="/loyalty"
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-label-md text-label-md uppercase tracking-[0.16em] font-bold hover:brightness-110 transition-all shadow-[0_4px_16px_rgba(222,107,144,0.3)] no-underline"
                  >
                    Claim Digital Card
                  </Link>
                  <Link
                    to="/login"
                    className="font-label-md text-label-md uppercase tracking-[0.16em] text-on-surface-variant hover:text-primary transition-colors no-underline font-semibold"
                  >
                    Cardholder Sign In →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CHEF'S TASTING FLIGHT & SIGNATURE CREATIONS ────────────── */}
      <section className="relative w-full py-24 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-[0.22em] text-secondary">
                Culinary Masterpieces
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                The Royal Degustation Highlights
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-[0.2em] text-primary hover:text-primary-fixed transition-colors no-underline font-semibold"
            >
              <span>Explore Entire Royal Carte</span>
              <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
            </Link>
          </div>

          {/* 3 Showcase Cards with High Elevation and Frosted Backdrop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dish 1: Dal Bukhara */}
            <div className="group rounded-3xl overflow-hidden bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-[0_16px_36px_-8px_rgba(24,10,12,0.85)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_24px_48px_-8px_rgba(222,107,144,0.25)] flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Dal Maharaja Bukhara"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAplJYTNJHyEIuBsMjYNIt4OltgBDJ5jP4R7jZx-asMAcnug39CEfjCSYBd3ol5poklHKsRSg-DunGr1uv4xEpaFPrHx_c1vCKnTkq2sVrOrC9niHyrow5BLVO7-b8Z3Zm1BSPwMmY_tF0H46QW1NexplLIFZrPqyKujrhFu8YVXpLEEq14J9_rfYY7qhGSqovDYRRNpwBzMQJ0Qb7LJZR3dHbqPhl92Fs4IawtC1xM"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/85 backdrop-blur-md border border-primary/30">
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary">
                    36-Hour Embers
                  </span>
                </div>
                <div className="absolute bottom-3 right-4 font-headline-sm text-headline-sm text-primary font-bold">
                  $38
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="material-symbols-outlined text-[16px]">eco</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest">Heritage Vegetarian</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Dal Maharaja Bukhara</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Whole black lentils simmered continuously for thirty-six hours on smoldering charcoal, finished with hand-churned village butter, ripe plum tomatoes, and ginger juliennes.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant/80 border-t border-outline-variant/30">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">wine_bar</span>
                    Pairing: Barolo Riserva 2018
                  </span>
                  <Link
                    to="/menu"
                    className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/40 hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center text-primary no-underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dish 2: Shahi Murgh Dum Biryani */}
            <div className="group rounded-3xl overflow-hidden bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-[0_16px_36px_-8px_rgba(24,10,12,0.85)] transition-all duration-500 hover:-translate-y-2 hover:border-secondary/40 hover:shadow-[0_24px_48px_-8px_rgba(228,193,148,0.2)] flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Shahi Murgh Dum Biryani"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADMFqR0L62vzQiDlAzq60lvAuw1UweS5n-Cv63U9nOU_ENLTpDjYofQE81zMOyRP_pkVH9JMLU3Mh58uaOmZDEA44yMbOOvCCNtqYmgz56OCcjVaJ0yVR6iOgdBPgvuDaihy0-RH9rElqpwHD4AKmuGyEet2IVgq5PGMnqfFVbbUw_kGOjxzOmXvOMAkuVemUsOXFqB6ch4_814BHV1jttIRLTIWBL1FkBtruP4fgz"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/85 backdrop-blur-md border border-secondary/30">
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
                    Chef's Signature
                  </span>
                </div>
                <div className="absolute bottom-3 right-4 font-headline-sm text-headline-sm text-primary font-bold">
                  $52
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <span className="material-symbols-outlined text-[16px]">restaurant</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest">Clay Pot Sealed Dum</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Shahi Murgh Dum Biryani</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Aged Dehradun extra-long basmati steeped in Kashmiri saffron, wild rose water, and organic spring chicken, sealed under a whole wheat crust and baked over low tandoor heat.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant/80 border-t border-outline-variant/30">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">wine_bar</span>
                    Pairing: Meursault Premier Cru
                  </span>
                  <Link
                    to="/menu"
                    className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/40 hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center text-primary no-underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dish 3: Galouti & Sheermal */}
            <div className="group rounded-3xl overflow-hidden bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-[0_16px_36px_-8px_rgba(24,10,12,0.85)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_24px_48px_-8px_rgba(222,107,144,0.25)] flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Nawabi Galouti & Sheermal"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkiAbNb6hPuMMWTxl0g4f70NrMaOGJpwcp5HcS9SFfXmo1ebTRJSa9UlqtPhGuevcckhHj4hPqIctkpNq4fP7XpCAv3t0yPaGrTa2_W1XyIBtCYAe-exf9fhBesQgrCsZ5WGu5CXkKrLRsDeqZeGbIk9SC3k5M9Y-lnTIgfIVe6xHcaOh-OKILwJJyhqB75MpQxlNHxFZNOGXrZUchdU6vEkrEEdpmg0ah1PT4rFXg"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/85 backdrop-blur-md border border-primary/30">
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary">
                    Royal Court Special
                  </span>
                </div>
                <div className="absolute bottom-3 right-4 font-headline-sm text-headline-sm text-primary font-bold">
                  $46
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest">160 Potent Spices</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Nawabi Galouti &amp; Sheermal</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Melt-in-the-mouth smoked baby lamb patties infused with raw papaya and pan-seared in rich clarified butter, served over warm saffron-cardamom brioche biscuits.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant/80 border-t border-outline-variant/30">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">wine_bar</span>
                    Pairing: Syrah Rhône Valley
                  </span>
                  <Link
                    to="/menu"
                    className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/40 hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center text-primary no-underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CRITICS' ENCOMIUM & PALACE RESERVATION CONCIERGE ────────── */}
      <section className="relative w-full py-24 bg-surface overflow-hidden">
        {/* Subtle rose ring in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5 opacity-40 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Gastronome Endorsement Card with Rose-Gold Trimmed Glassmorphism */}
          <div className="mb-20 p-8 lg:p-14 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl shadow-[0_24px_50px_rgba(24,10,12,0.85)] text-center relative">
            <span className="material-symbols-outlined text-primary text-[48px] opacity-40 mb-4 inline-block">
              format_quote
            </span>
            <blockquote className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface max-w-3xl mx-auto leading-snug mb-8">
              “Urban Maharaja is not merely dining; it is an exalted voyage into the opulent banquets of Rajasthan’s sovereign princes. Every bite is poetry, smoke, and gold.”
            </blockquote>
            <div className="flex flex-col items-center">
              <p className="font-title-md text-title-md text-primary font-bold">Antoine de Saint-Germain</p>
              <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
                Grand Gastronomie Gazette Paris
              </p>
            </div>
          </div>

          {/* Palace Table Reservation Pill Container in Rosewood Imperial Palette */}
          <div className="rounded-3xl p-8 lg:p-12 bg-gradient-to-r from-surface-container-lowest via-surface-container-high to-surface-container-lowest border border-outline-variant/40 shadow-[0_24px_60px_rgba(24,10,12,0.95)]">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-md text-center lg:text-left">
                <span className="font-label-md text-label-md uppercase tracking-[0.22em] text-primary">
                  The Sovereign Table
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                  Reserve Your Imperial Seat
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  Evening degustations are strictly limited to twenty-four patrons to guarantee intimate master-chef service.
                </p>
              </div>

              {/* Quick Interactive Booking Bar */}
              <form onSubmit={handleQuickReservation} className="w-full lg:w-auto flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                  <input
                    className="bg-transparent text-body-sm text-on-surface font-body-sm focus:outline-none w-full cursor-pointer"
                    type="text"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>

                <div className="flex-1 min-w-[130px] px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                  <select
                    className="bg-transparent text-body-sm text-on-surface font-body-sm focus:outline-none w-full cursor-pointer"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                  >
                    <option className="bg-surface-container text-on-surface" value="2 Royalty">2 Royalty</option>
                    <option className="bg-surface-container text-on-surface" value="4 Royalty">4 Royalty</option>
                    <option className="bg-surface-container text-on-surface" value="6+ Banquet">6+ Banquet</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[150px] px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">chair</span>
                  <select
                    className="bg-transparent text-body-sm text-on-surface font-body-sm focus:outline-none w-full cursor-pointer"
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
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-container to-secondary hover:brightness-110 text-surface-container-lowest font-label-md text-label-md uppercase tracking-[0.16em] font-bold shadow-[0_8px_20px_rgba(222,107,144,0.35)] transition-all cursor-pointer"
                >
                  Confirm Seat
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
