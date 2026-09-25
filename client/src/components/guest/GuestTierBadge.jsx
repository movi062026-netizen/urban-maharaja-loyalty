import { Crown, Sparkles, ShieldCheck } from 'lucide-react';
import { getTierInfo } from '../../utils/helpers';

export default function GuestTierBadge({ totalApprovedStamps = 0 }) {
  const tier = getTierInfo(totalApprovedStamps);

  return (
    <div className="w-full rounded-[28px] p-5 sm:p-6 glass-panel-elevated relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 text-on-surface">
      {/* Dynamic ambient highlight */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3.5 sm:gap-4.5 w-full sm:w-auto">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary-container/30 to-secondary/20 border border-primary/40 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(222,107,144,0.3)] shrink-0">
          <Crown className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-bold text-on-surface tracking-wide">
              {tier.name} Tier
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-surface-container-highest/80 text-secondary border border-secondary/30 font-semibold shadow-sm">
              {tier.badge}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Lifetime verified seals: <span className="font-bold text-secondary font-mono">{totalApprovedStamps}</span>
          </p>
        </div>
      </div>

      {tier.nextTier ? (
        <div className="text-center sm:text-right w-full sm:w-auto bg-surface-container-lowest/60 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-white/5 sm:border-none">
          <p className="text-[11px] text-on-surface-variant font-mono">
            Next Royal Tier: <span className="font-semibold text-secondary">{tier.nextTier}</span>
          </p>
          <p className="text-xs sm:text-sm font-bold text-primary mt-0.5 flex items-center justify-center sm:justify-end gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tier.needed} more seal{tier.needed > 1 ? 's' : ''} to ascend</span>
          </p>
        </div>
      ) : (
        <div className="text-center sm:text-right">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary-container/20 border border-primary/30">
            <Sparkles className="w-4 h-4 text-secondary" /> Supreme Royal Tier Reached
          </span>
        </div>
      )}
    </div>
  );
}
