import { Gift, Sparkles, Clock, Crown, ArrowRight, Check, Utensils, Wine, Award, Percent } from 'lucide-react';

const typeIcons = {
  COMPLIMENTARY_ITEM: Utensils,
  FREE_BEVERAGE: Wine,
  SPECIAL_EXPERIENCE: Crown,
  DISCOUNT_PERCENTAGE: Percent,
  DISCOUNT_FLAT: Award,
  CUSTOM: Gift,
};

export default function RewardCard({ reward, onRedeem, isRedeemable = false, isClaimed = false }) {
  if (!reward) return null;

  const Icon = typeIcons[reward.rewardType] || Gift;

  return (
    <div
      className={`rounded-[24px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
        isRedeemable
          ? 'bg-white border-2 border-primary/50 shadow-[0_20px_45px_-10px_rgba(155,40,78,0.22)] ring-4 ring-primary/10 hover:shadow-[0_24px_55px_-10px_rgba(155,40,78,0.3)] hover:-translate-y-1'
          : isClaimed
          ? 'bg-[#faf6f1] border border-[#d8c7b6] shadow-xs'
          : 'bg-white border border-[#e4d3c2] hover:border-primary/40 shadow-[0_10px_30px_-10px_rgba(46,26,16,0.07)] hover:shadow-[0_18px_40px_-10px_rgba(46,26,16,0.12)] hover:-translate-y-1'
      }`}
    >
      {/* Top Royal Ribbon Accent */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{
          background: isRedeemable
            ? 'linear-gradient(90deg, #ba3461 0%, #e882a3 35%, #cca056 70%, #ba3461 100%)'
            : isClaimed
            ? '#8c7664'
            : 'linear-gradient(90deg, #744d1c 0%, #cca056 50%, #744d1c 100%)',
        }}
      />

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105 duration-300 ${
                  isRedeemable
                    ? 'bg-gradient-to-br from-primary-container to-secondary text-white border border-white/40 shadow-[0_8px_20px_-4px_rgba(155,40,78,0.4)]'
                    : 'bg-[#fdfaf6] border border-[#e4d3c2] text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#744d1c] block font-sans">
                  Palace Privilege
                </span>
                <h3 className="font-serif font-bold text-on-surface text-base sm:text-lg leading-snug line-clamp-1">
                  {reward.title}
                </h3>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                isClaimed
                  ? 'bg-stone-200 text-stone-900 border-stone-400'
                  : isRedeemable
                  ? 'bg-primary-container text-white border-transparent shadow-xs animate-pulse'
                  : 'bg-[#fdfaf6] text-primary border-primary/20'
              }`}
            >
              {isClaimed ? 'Claimed' : isRedeemable ? 'Unlocked • Pick 1' : `${reward.requiredStamps || 5} Seals`}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-[13px] text-[#3b241a] font-medium leading-relaxed font-sans mb-4 min-h-[38px] line-clamp-2">
            {reward.description || 'Complimentary luxury dining perk crafted by our royal khansamas.'}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3.5 border-t border-[#eee0d2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#483328] font-mono text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span>Valid {reward.validityDays || 30} Days</span>
          </div>

          {isRedeemable && onRedeem ? (
            <button
              type="button"
              onClick={() => onRedeem(reward)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-container via-[#d44877] to-secondary text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim This Reward</span>
            </button>
          ) : isClaimed ? (
            <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Claimed</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
              Collect {reward.requiredStamps || 5} Seals to Unlock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
