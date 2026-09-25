import { Crown, Sparkles, Award } from 'lucide-react';

/**
 * Ultra-Luxury Glassmorphic Digital Maharaja Card
 * Crafted with multi-layer frosted glass, iridescent specular highlights,
 * authentic gold foil EMV circuit, and responsive royal seals.
 */
export default function MaharajaCard({
  guestName,
  currentStamps = 0,
  targetStamps = 5,
  cycleNumber = 1,
  isComplete = false,
}) {
  const stamps = currentStamps || 0;
  const target = targetStamps || 5;

  const getTierLabel = () => {
    if (isComplete || stamps >= target) return { label: 'Sovereign Reward', color: 'from-amber-400 via-rose-300 to-yellow-200' };
    if (stamps >= 3) return { label: 'Ruby Sovereign', color: 'from-rose-400 via-pink-300 to-secondary' };
    return { label: 'Emerald Noble', color: 'from-emerald-400 via-teal-300 to-primary' };
  };

  const tier = getTierLabel();

  return (
    <div
      className="relative w-full max-w-[480px] aspect-[1.58/1] min-h-[230px] rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 glass-card-royal overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_32px_70px_-15px_rgba(222,107,144,0.4)] text-on-surface select-none group"
      role="region"
      aria-label="Digital Maharaja Card"
    >
      {/* ── Dynamic Iridescent Glass Glows ────────────────────────────── */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-primary-container/30 to-secondary/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-gradient-to-tr from-secondary/20 to-primary-container/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── Holographic Specular Sweep Beam ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
        <div className="w-[120%] h-full bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12 animate-holographic-shine" />
      </div>

      {/* ── Traditional Palace Jaali Watermark ───────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffb1c6 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* ── Card Content Container ───────────────────────────────────── */}
      <div className="relative h-full flex flex-col justify-between z-10">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Crest */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-primary-container/30 to-secondary/20 border border-primary/40 flex items-center justify-center shadow-inner shrink-0">
              <Crown className="w-5 h-5 sm:w-5 sm:h-5 text-secondary" />
            </div>
            <div>
              <span className="font-serif text-sm sm:text-base font-bold tracking-[0.16em] uppercase text-on-surface block leading-tight">
                URBAN MAHARAJA
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.25em] text-secondary font-semibold">
                Imperial Dining Card
              </span>
            </div>
          </div>

          {/* Tier Glass Badge */}
          <div className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-surface-container-highest/60 backdrop-blur-md border border-white/15 shadow-sm shrink-0">
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
              {tier.label}
            </span>
          </div>
        </div>

        {/* Middle Row: EMV Gold Chip & Contactless Waves */}
        <div className="my-auto py-1 sm:py-2">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-3">
              {/* Micro-etched Gold EMV Chip */}
              <div className="w-10 h-7 sm:w-11 sm:h-8 rounded-lg glass-chip flex flex-col justify-between p-1.5 shrink-0 relative overflow-hidden">
                <div className="w-full h-[1px] bg-secondary/50 my-auto" />
                <div className="absolute inset-0 border border-secondary/30 rounded-lg pointer-events-none" />
                <div className="flex justify-between items-center text-[7px] font-mono text-secondary/80">
                  <span>UM</span>
                  <Sparkles className="w-2.5 h-2.5 text-secondary" />
                </div>
              </div>

              {/* Contactless Wave Icon */}
              <div className="flex items-center text-on-surface-variant/80">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  contactless
                </span>
                <span className="text-[10px] sm:text-xs font-mono ml-2 text-on-surface-variant/70">
                  {cycleNumber > 1 ? `Cycle #${cycleNumber}` : 'Pass #1'}
                </span>
              </div>
            </div>

            {/* Seals Counter Pill */}
            <div className="px-3 py-1 rounded-full bg-surface-container-lowest/80 border border-white/10 text-right">
              <span className="font-serif text-xs sm:text-sm font-bold text-primary">
                {stamps}
              </span>
              <span className="text-[10px] text-on-surface-variant/70 font-mono"> / {target} Seals</span>
            </div>
          </div>

          {/* ── 5 Imperial Seal Discs with Glassmorphism ────────────── */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 py-1">
            {Array.from({ length: target }, (_, i) => {
              const collected = i < stamps;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-500 ${
                    collected
                      ? 'glass-seal-unlocked scale-105'
                      : 'glass-seal-locked text-on-surface-variant/40'
                  }`}
                  title={collected ? `Seal #${i + 1} Approved` : `Seal #${i + 1} Open`}
                >
                  {collected ? (
                    <>
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                      <span className="text-[7px] sm:text-[8px] font-bold text-white uppercase tracking-tighter mt-0.5 drop-shadow">
                        #{i + 1}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] sm:text-xs font-serif font-bold text-on-surface-variant/50">
                        {i + 1}
                      </span>
                      <span className="text-[7px] uppercase tracking-tighter text-outline">Open</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Footer: Patron Name & Card Expiry */}
        <div className="flex items-end justify-between pt-1 border-t border-white/10">
          <div>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-secondary/90 font-mono block">
              Noble Patron
            </span>
            <p className="font-serif text-xs sm:text-sm md:text-base font-bold text-on-surface tracking-wider uppercase truncate max-w-[220px] sm:max-w-[280px]">
              {guestName || 'Valued Royal Guest'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/70 font-mono block">
              Validity
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-primary">
              LIFETIME
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
