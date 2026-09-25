import { Crown, Sparkles, Award } from 'lucide-react';
import { getTierInfo } from '../../utils/helpers';

export default function GuestTierBadge({ totalApprovedStamps = 0 }) {
  const tier = getTierInfo(totalApprovedStamps);

  return (
    <div className={`rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${tier.bgClass} border ${tier.borderClass} shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-high/80 border border-primary/30 flex items-center justify-center text-primary shadow-lg shrink-0">
          <Crown className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-on-surface">
              {tier.name} Tier
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-surface-container-high/90 text-secondary border border-secondary/30 font-semibold">
              {tier.badge}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Lifetime verified seals: <span className="font-bold text-on-surface">{totalApprovedStamps}</span>
          </p>
        </div>
      </div>

      {tier.nextTier ? (
        <div className="text-center sm:text-right">
          <p className="text-[11px] text-on-surface-variant">
            Next Tier: <span className="font-semibold text-secondary">{tier.nextTier}</span>
          </p>
          <p className="text-xs font-bold text-primary">
            {tier.needed} more seal{tier.needed > 1 ? 's' : ''} to ascend
          </p>
        </div>
      ) : (
        <div className="text-center sm:text-right">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Supreme Royal Tier
          </span>
        </div>
      )}
    </div>
  );
}
