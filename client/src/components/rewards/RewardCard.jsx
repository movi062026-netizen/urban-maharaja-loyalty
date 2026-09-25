import { Gift, Sparkles, Clock, Crown } from 'lucide-react';

export default function RewardCard({ reward, onRedeem, isRedeemable = false, isClaimed = false }) {
  if (!reward) return null;

  return (
    <div
      className={`p-5 sm:p-6 rounded-[24px] glass-panel-elevated flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-[0_20px_45px_-12px_rgba(222,107,144,0.3)] text-on-surface relative overflow-hidden ${
        isClaimed ? 'opacity-60 border-dashed' : ''
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-container/30 to-secondary/20 border border-primary/40 flex items-center justify-center text-secondary shadow-sm shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-on-surface text-base sm:text-lg leading-snug">
                {reward.title}
              </h3>
              <span className="text-[10px] text-secondary uppercase tracking-[0.2em] font-mono font-semibold">
                {reward.requiredStamps ? `${reward.requiredStamps} Royal Seals` : 'Sovereign Reward'}
              </span>
            </div>
          </div>

          <span
            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
              isClaimed
                ? 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                : isRedeemable
                ? 'bg-secondary/25 text-secondary border-secondary/40 animate-pulse'
                : 'bg-primary-container/20 text-primary border-primary/30'
            }`}
          >
            {isClaimed ? 'Redeemed' : isRedeemable ? 'Ready to Claim' : 'Catalog Privilege'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed my-3 font-sans">
          {reward.description || 'Complimentary luxury dining perk for our esteemed court members.'}
        </p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-on-surface-variant/80 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span>Valid for {reward.validityDays || 30} Days</span>
        </div>

        {isRedeemable && onRedeem && (
          <button
            type="button"
            onClick={() => onRedeem(reward)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Claim Perk</span>
          </button>
        )}
      </div>
    </div>
  );
}
