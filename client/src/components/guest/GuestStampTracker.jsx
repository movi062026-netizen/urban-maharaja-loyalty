import { CheckCircle2, Clock, Upload, Image } from 'lucide-react';

// Light luminous jewel seal themes matching MaharajaCard
const sealThemes = [
  {
    name: 'Champagne Gold',
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
    shadow: '0 8px 22px -3px rgba(245, 158, 11, 0.4)',
    ring: 'rgba(217, 119, 6, 0.65)',
    textColor: '#78350f',
  },
  {
    name: 'Rose Pearl',
    bg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 50%, #fb7185 100%)',
    shadow: '0 8px 22px -3px rgba(251, 113, 133, 0.4)',
    ring: 'rgba(225, 29, 72, 0.65)',
    textColor: '#881337',
  },
  {
    name: 'Crystal Jade',
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)',
    shadow: '0 8px 22px -3px rgba(52, 211, 153, 0.4)',
    ring: 'rgba(5, 150, 105, 0.65)',
    textColor: '#064e3b',
  },
  {
    name: 'Amethyst Quartz',
    bg: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 50%, #c084fc 100%)',
    shadow: '0 8px 22px -3px rgba(192, 132, 252, 0.4)',
    ring: 'rgba(147, 51, 234, 0.65)',
    textColor: '#581c87',
  },
  {
    name: 'Sunburst Gold',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef08a 45%, #eab308 100%)',
    shadow: '0 10px 26px -3px rgba(234, 179, 8, 0.5)',
    ring: 'rgba(202, 138, 4, 0.75)',
    textColor: '#713f12',
  },
];

export default function GuestStampTracker({
  currentStamps = 0,
  targetStamps = 5,
  cycleNumber = 1,
  pendingStamp = null,
  onRequestStamp,
  requesting = false,
  isComplete = false,
}) {
  const stampsArray = Array.from({ length: targetStamps }, (_, i) => i < currentStamps);

  return (
    <div className="w-full rounded-[24px] p-5 sm:p-7 glass-panel-elevated relative overflow-hidden text-on-surface">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-secondary font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Cycle #{cycleNumber} Progress</span>
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface mt-1">
              Imperial Dining Seals
            </h3>
          </div>
          <div className="flex items-baseline gap-1.5 px-4 py-2 rounded-full bg-white/60 border border-outline-variant/30">
            <span className="font-serif text-2xl sm:text-3xl font-black text-primary leading-none">
              {currentStamps}
            </span>
            <span className="text-on-surface-variant/60 text-xs sm:text-sm font-mono">/ {targetStamps} Seals</span>
          </div>
        </div>

        {/* Circular Stamp Seals — Light luminous tones */}
        <div className="grid grid-cols-5 gap-2.5 sm:gap-4 mb-6">
          {stampsArray.map((collected, index) => {
            const theme = sealThemes[index % sealThemes.length];
            return (
              <div
                key={index}
                className="aspect-square rounded-full flex flex-col items-center justify-center relative transition-all duration-500"
                style={collected ? {
                  background: theme.bg,
                  boxShadow: theme.shadow,
                  border: `2px solid ${theme.ring}`,
                  transform: 'scale(1.05)',
                } : {
                  background: 'rgba(255,255,255,0.45)',
                  border: '2px dashed rgba(195,165,135,0.6)',
                }}
              >
                {collected ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 flex items-center justify-center shadow-sm">
                      <span className="font-serif text-xs sm:text-sm font-black" style={{ color: theme.textColor }}>
                        #{index + 1}
                      </span>
                    </div>
                    <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider mt-1" style={{ color: theme.textColor }}>
                      SEALED
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="text-sm sm:text-base font-serif font-bold text-on-surface-variant/40">
                      {index + 1}
                    </span>
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-on-surface-variant/30 font-mono">Open</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Multi-gradient Progress Bar */}
        <div className="w-full bg-white/40 h-2.5 rounded-full overflow-hidden mb-6 border border-outline-variant/25 p-[2px]">
          <div
            className="h-full transition-all duration-700 rounded-full"
            style={{
              width: `${Math.min(100, (currentStamps / targetStamps) * 100)}%`,
              background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #f59e0b, #ec4899)',
              boxShadow: '0 0 12px rgba(99,102,241,0.4)',
            }}
          />
        </div>

        {/* Pending Banner */}
        {pendingStamp && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-amber-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Seal Request Pending Verification</span>
                </p>
                <p className="text-[11px] text-amber-600/70 font-mono mt-0.5 truncate">
                  {pendingStamp.billNumber ? `Receipt #${pendingStamp.billNumber}` : 'Bill Submitted'} • Awaiting concierge
                </p>
              </div>
            </div>
            {pendingStamp.billUrl && (
              <a
                href={pendingStamp.billUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-400/40 text-amber-700 font-semibold text-[11px] inline-flex items-center gap-1 shrink-0 transition-colors no-underline"
              >
                <Image className="w-3.5 h-3.5" />
                <span>View Bill</span>
              </a>
            )}
          </div>
        )}

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/15">
          <p className="text-xs text-on-surface-variant text-center sm:text-left leading-relaxed">
            {isComplete ? (
              <span className="text-primary font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <CheckCircle2 className="w-4 h-4" /> Card complete — reward voucher unlocked!
              </span>
            ) : (
              <span>Each dining visit earns 1 seal. Upload your bill to get verified.</span>
            )}
          </p>

          {!isComplete && !pendingStamp && (
            <button
              type="button"
              onClick={onRequestStamp}
              disabled={requesting}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-xs uppercase tracking-[0.14em] font-bold shadow-[0_8px_24px_-4px_rgba(154,45,82,0.4)] hover:shadow-[0_12px_32px_-4px_rgba(154,45,82,0.5)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {requesting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Bill &amp; Request Seal</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
