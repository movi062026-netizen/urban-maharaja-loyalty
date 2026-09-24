/**
 * Digital Maharaja Card — The centerpiece of the loyalty experience.
 * Styled with the imperial rosewood, gold filigree, contactless chip, and regal stamp seals.
 */
export default function MaharajaCard({
  guestName,
  currentStamps,
  targetStamps,
  cycleNumber,
  isComplete,
}) {
  const stamps = currentStamps || 0;
  const target = targetStamps || 5;
  const remaining = Math.max(0, target - stamps);

  return (
    <div
      className="relative w-full max-w-md aspect-[1.58/1] rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-surface-bright via-surface-container to-surface-container-lowest border border-primary-container/50 shadow-[0_24px_50px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-500 hover:scale-[1.02] text-on-surface"
      role="region"
      aria-label="Digital Maharaja Card"
    >
      {/* Radial rose-gold sheen orb */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-primary-container/25 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative h-full flex flex-col justify-between z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[28px]">crown</span>
            <div className="leading-tight">
              <span className="font-headline-sm text-title-md text-primary font-bold tracking-widest uppercase block">
                Maharaja
              </span>
              <span className="font-label-sm text-[9px] uppercase tracking-[0.25em] text-secondary font-semibold">
                Urban Maharaja
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary-container/30 border border-primary/40 text-primary font-bold">
            {stamps >= target ? 'Royal Reward Unlocked' : stamps >= 3 ? 'Ruby Sovereign' : 'Emerald Patron'}
          </span>
        </div>

        {/* Contactless Chip & Stamp Seals */}
        <div className="my-auto py-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-7 rounded bg-primary-container/40 border border-primary/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface text-[18px]">contactless</span>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">
                {cycleNumber > 1 ? `Cycle ${cycleNumber}` : 'Royal Pass'}
              </span>
            </div>

            <span className="font-label-sm uppercase tracking-widest text-secondary font-semibold">
              {stamps} / {target} Seals
            </span>
          </div>

          {/* Stamp Seals Progress */}
          <div className="flex items-center justify-between gap-2 px-1 py-2">
            {Array.from({ length: target }, (_, i) => {
              const filled = i < stamps;
              return (
                <div
                  key={i}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    filled
                      ? 'bg-gradient-to-tr from-primary-container to-secondary text-surface-container-lowest shadow-[0_0_12px_rgba(222,107,144,0.6)] font-bold scale-105'
                      : 'bg-surface-container-high/60 border border-outline-variant/40 text-outline-variant'
                  }`}
                  title={filled ? `Stamp ${i + 1} Approved` : `Pending Stamp ${i + 1}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {filled ? 'military_tech' : 'lock'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Footer: Guest Name & Expiration */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="font-label-sm text-[10px] text-secondary uppercase tracking-[0.2em] mb-0.5">
              Imperial Member
            </p>
            <p className="font-title-md text-title-md text-on-surface font-mono tracking-wider uppercase font-semibold">
              {guestName || 'Royal Guest'}
            </p>
          </div>

          <div className="text-right">
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
              Validity
            </p>
            <span className="font-label-sm text-label-sm text-primary font-mono tracking-widest">
              LIFETIME
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
