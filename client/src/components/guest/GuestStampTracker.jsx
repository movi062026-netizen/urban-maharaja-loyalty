import { Check, Clock, Sparkles, Stamp } from 'lucide-react';

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
    <div className="rounded-3xl p-6 sm:p-7 bg-surface-container-high/80 border border-outline-variant/40 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-secondary font-bold">
            Card Cycle #{cycleNumber}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
            Imperial Seal Collection
          </h3>
        </div>
        <div className="text-right">
          <span className="font-serif text-2xl font-bold text-primary">
            {currentStamps}
          </span>
          <span className="text-on-surface-variant/70 text-sm"> / {targetStamps} Seals</span>
        </div>
      </div>

      {/* Visual Seal Dots */}
      <div className="grid grid-cols-5 gap-3 sm:gap-4 my-6">
        {stampsArray.map((collected, index) => (
          <div
            key={index}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 ${
              collected
                ? 'bg-gradient-to-br from-primary-container via-surface-container to-secondary/30 border-2 border-primary shadow-[0_0_20px_rgba(222,107,144,0.4)] scale-105'
                : 'bg-surface-container-low/70 border border-outline-variant/30 text-on-surface-variant/40'
            }`}
          >
            {collected ? (
              <>
                <Stamp className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-[9px] font-bold text-primary tracking-widest uppercase mt-1">
                  Seal #{index + 1}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs font-serif font-bold text-on-surface-variant/50">
                  {index + 1}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-outline">Open</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-container-lowest/80 h-2.5 rounded-full overflow-hidden mb-6 border border-outline-variant/20">
        <div
          className="bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary h-full transition-all duration-500 rounded-full"
          style={{ width: `${Math.min(100, (currentStamps / targetStamps) * 100)}%` }}
        />
      </div>

      {/* Action and Explanations */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/25">
        <p className="text-xs text-on-surface-variant text-center sm:text-left">
          {isComplete ? (
            <span className="text-secondary font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Card complete! Voucher unlocked in Royal Rewards.
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
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.14em] font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {requesting ? (
              <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Stamp className="w-4 h-4" />
                <span>Request Visit Stamp</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
