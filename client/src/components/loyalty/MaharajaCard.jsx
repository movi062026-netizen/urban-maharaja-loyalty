import { Crown } from 'lucide-react';

/**
 * Digital Maharaja Card — The centerpiece of the loyalty experience.
 * Displays guest name, stamp progress, and reward status.
 */
export default function MaharajaCard({ guestName, currentStamps, targetStamps, cycleNumber, isComplete }) {
  const stamps = currentStamps || 0;
  const target = targetStamps || 5;
  const remaining = Math.max(0, target - stamps);

  return (
    <div className="maharaja-card p-6 sm:p-8 text-white animate-fadeIn" role="region" aria-label="Maharaja Loyalty Card">
      {/* Top ornamental line */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-royal-gold/40" />
        <Crown className="w-5 h-5 text-royal-gold" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-royal-gold/40" />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6 relative z-10">
        <h2 className="font-serif text-xl sm:text-2xl tracking-[0.15em] text-white/90">URBAN MAHARAJA</h2>
        <p className="text-[10px] tracking-[0.3em] text-royal-gold/70 mt-1">A FINE DINE</p>
        <div className="mt-3 inline-block px-5 py-1.5 border border-royal-gold/30 rounded-full">
          <span className="text-xs tracking-[0.2em] text-royal-gold font-medium">MAHARAJA CARD</span>
        </div>
      </div>

      {/* Guest Name */}
      <div className="text-center mb-6 relative z-10">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Guest</p>
        <p className="font-serif text-lg text-white/90">{guestName || 'Royal Guest'}</p>
        {cycleNumber > 1 && (
          <p className="text-[10px] text-royal-gold/60 mt-1">Cycle {cycleNumber}</p>
        )}
      </div>

      {/* Progress Label */}
      <div className="text-center mb-4 relative z-10">
        <p className="text-xs text-royal-gold/70 uppercase tracking-[0.2em]">Royal Progress</p>
      </div>

      {/* Stamps */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-5 relative z-10" role="progressbar" aria-valuenow={stamps} aria-valuemin={0} aria-valuemax={target} aria-label={`${stamps} of ${target} stamps collected`}>
        {Array.from({ length: target }, (_, i) => (
          <div
            key={i}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
              i < stamps
                ? 'stamp-filled'
                : 'stamp-empty'
            }`}
            aria-hidden="true"
          >
            {i < stamps ? (
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-deep-brown" />
            ) : (
              <span className="text-xs text-white/20">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Count */}
      <div className="text-center mb-4 relative z-10">
        <p className="text-2xl font-serif text-white">
          <span className="text-royal-gold">{stamps}</span>
          <span className="text-white/30 mx-1">/</span>
          <span className="text-white/60">{target}</span>
        </p>
        <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Royal Stamps</p>
      </div>

      {/* Status Message */}
      <div className="text-center relative z-10">
        {isComplete ? (
          <div className="inline-block px-4 py-2 bg-royal-gold/20 rounded-full border border-royal-gold/30">
            <p className="text-sm text-royal-gold font-medium tracking-wide">🎉 Reward Unlocked!</p>
          </div>
        ) : (
          <p className="text-sm text-white/50">
            {remaining === 1 ? '1 visit to unlock your reward' : `${remaining} visits to unlock your reward`}
          </p>
        )}
      </div>

      {/* Bottom ornamental line */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-royal-gold/40" />
        <div className="w-2 h-2 rotate-45 border border-royal-gold/40" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-royal-gold/40" />
      </div>
    </div>
  );
}
