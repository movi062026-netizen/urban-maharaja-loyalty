import { Crown, Sparkles, Stamp, CheckCircle2 } from 'lucide-react';

export default function GuestStampTracker({
  currentStamps = 0,
  targetStamps = 5,
  cycleNumber = 1,
  onRequestStamp,
  requesting = false,
  isComplete = false,
}) {
  const stampsArray = Array.from({ length: targetStamps }, (_, i) => i < currentStamps);

  return (
    <div className="w-full rounded-[28px] p-5 sm:p-7 glass-panel-elevated relative overflow-hidden text-on-surface">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-secondary font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Card Cycle #{cycleNumber} Progress</span>
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface mt-0.5">
            Imperial Dining Seals
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            {currentStamps}
          </span>
          <span className="text-on-surface-variant/70 text-xs sm:text-sm font-mono"> / {targetStamps} Seals Collected</span>
        </div>
      </div>

      {/* Visual Seal Dots */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3.5 my-5">
        {stampsArray.map((collected, index) => (
          <div
            key={index}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-500 ${
              collected
                ? 'glass-seal-unlocked scale-105'
                : 'glass-seal-locked text-on-surface-variant/40'
            }`}
          >
            {collected ? (
              <>
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] animate-pulse" />
                <span className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wider mt-1 drop-shadow">
                  Seal #{index + 1}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm font-serif font-bold text-on-surface-variant/50">
                  {index + 1}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-outline font-mono">Open</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Glassmorphic Progress Bar */}
      <div className="w-full bg-surface-container-lowest/80 h-3 rounded-full overflow-hidden mb-5 border border-white/10 p-0.5">
        <div
          className="bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary h-full transition-all duration-700 rounded-full shadow-[0_0_12px_rgba(222,107,144,0.6)]"
          style={{ width: `${Math.min(100, (currentStamps / targetStamps) * 100)}%` }}
        />
      </div>

      {/* Action and Explanations */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <p className="text-xs text-on-surface-variant text-center sm:text-left leading-relaxed">
          {isComplete ? (
            <span className="text-secondary font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Card complete! Voucher unlocked in Royal Rewards.
            </span>
          ) : (
            <span>Each dining visit earns 1 official seal verified by your table concierge.</span>
          )}
        </p>

        {!isComplete && (
          <button
            type="button"
            onClick={onRequestStamp}
            disabled={requesting}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.14em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {requesting ? (
              <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Stamp className="w-4 h-4" />
                <span>Request Visit Seal</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
