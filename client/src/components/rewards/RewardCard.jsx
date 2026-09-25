import { Gift, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export default function RewardCard({ reward, onRedeem, isRedeemable = false, isClaimed = false }) {
  if (!reward) return null;

  return (
    <div className={`p-5 rounded-2xl bg-surface-container/85 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01] ${
      isClaimed ? 'opacity-60 border-dashed' : ''
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-on-surface text-base">{reward.title}</h3>
              <span className="text-[10px] text-secondary uppercase tracking-wider font-mono font-semibold">
                {reward.rewardType?.replace(/_/g, ' ') || 'Royal Perk'}
              </span>
            </div>
          </div>

          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            isClaimed
              ? 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
              : isRedeemable
              ? 'bg-green-500/20 text-green-300 border-green-500/30 animate-pulse'
              : 'bg-primary-container/20 text-primary border-primary/30'
          }`}>
            {isClaimed ? 'Redeemed' : isRedeemable ? 'Ready to Claim' : 'Unlocked'}
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
          {reward.description || 'Complimentary luxury dining perk for our esteemed court members.'}
        </p>
      </div>

      <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-mono">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span>Valid for {reward.validityDays || 30} Days</span>
        </div>

        {isRedeemable && onRedeem && (
          <button
            type="button"
            onClick={() => onRedeem(reward)}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Present to Staff</span>
          </button>
        )}
      </div>
    </div>
  );
}
