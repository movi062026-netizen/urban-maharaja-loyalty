import { useState, useEffect } from 'react';
import { rewardApi, loyaltyApi } from '../../services/api';
import { Gift, Sparkles, CheckCircle2, Award, Clock } from 'lucide-react';
import GuestRedemptionVoucher from '../../components/guest/GuestRedemptionVoucher';
import RewardCard from '../../components/rewards/RewardCard';
import ProgramTermsCard from '../../components/common/ProgramTermsCard';
import toast from 'react-hot-toast';

export default function RewardsPage() {
  const [redemptions, setRedemptions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [redemptionsRes, rewardsRes, cardRes] = await Promise.allSettled([
        rewardApi.getMyRedemptions(),
        rewardApi.getActiveRewards(),
        loyaltyApi.getMyCard(),
      ]);

      if (redemptionsRes.status === 'fulfilled') {
        setRedemptions(redemptionsRes.value.data.data.redemptions || []);
      }
      if (rewardsRes.status === 'fulfilled') {
        setRewards(rewardsRes.value.data.data.rewards || []);
      }
      if (cardRes.status === 'fulfilled') {
        setCardData(cardRes.value.data.data);
      }
    } catch (err) {
      toast.error('Failed to load royal rewards catalog');
    } finally {
      setLoading(false);
    }
  };

  const activeCard = cardData?.card;
  const isCardComplete = (activeCard?.currentStamps || 0) >= (activeCard?.targetStamps || 5);
  // Check if a voucher was already claimed for this active card cycle
  const hasClaimedForActiveCard = redemptions.some(
    (r) => r.loyaltyCardId === activeCard?._id || r.cycleNumber === activeCard?.cycleNumber
  );
  const canChooseOneReward = isCardComplete && !hasClaimedForActiveCard;

  const handleClaimReward = async (reward) => {
    if (!activeCard) {
      toast.error('No active loyalty card found');
      return;
    }
    if (claiming) return;

    try {
      setClaiming(true);
      await loyaltyApi.claimReward({
        rewardId: reward._id,
        loyaltyCardId: activeCard._id,
      });
      toast.success(`🎉 You claimed: ${reward.title}! Your voucher is ready below.`);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to claim reward');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-surface-container/60 border border-outline-variant/30" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slideUp text-on-surface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#eee0d2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
              Palace Privileges &amp; Honors
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold">Your Rewards</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Every time you visit Urban Maharaja, you have the opportunity to collect rewards. Keep track of your visits, and enjoy something extra the next time you dine with us.
          </p>
        </div>

        {activeCard && (
          <div className="px-4 py-2 rounded-2xl bg-white border border-[#e4d3c2] shadow-xs flex items-center gap-3 shrink-0">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-secondary block font-sans">Current Progress</span>
              <span className="font-serif text-sm font-bold text-primary">
                Cycle #{activeCard.cycleNumber || 1} • {activeCard.currentStamps || 0}/5 Seals
              </span>
            </div>
            <span className="material-symbols-outlined text-[24px] text-primary">military_tech</span>
          </div>
        )}
      </div>

      {/* Choose ONE Reward Banner (When Card is Complete & Unclaimed) */}
      {canChooseOneReward && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-primary/40 shadow-[0_20px_50px_-12px_rgba(155,40,78,0.2)] ring-4 ring-primary/10 relative overflow-hidden animate-scaleIn">
          {/* Subtle background ambient light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-container/10 via-secondary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white shadow-lg shrink-0 border border-white/40">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary-container/10 px-3 py-1 rounded-full inline-block mb-1.5 border border-primary/20">
                  🎉 Pass Cycle #{activeCard?.cycleNumber || 1} Complete!
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
                  Choose Your Royal Dining Privilege
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mt-1 leading-relaxed">
                  You have successfully collected all 5 royal seals! Select <strong>ONE complimentary reward</strong> from the catalog below to issue your dining voucher.
                </p>
              </div>
            </div>

            <div className="shrink-0 text-center md:text-right bg-[#fdfaf6] p-4 rounded-2xl border border-[#ede0d2]">
              <span className="text-xs font-bold text-primary block uppercase tracking-wider">1 Reward Choice Unlocked</span>
              <span className="text-[11px] text-on-surface-variant mt-0.5 block">Click "Claim This Reward" on any card below</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Unlocked Vouchers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-[#1d0f09] uppercase tracking-[0.18em] flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Active Dining Certificates &amp; Vouchers ({redemptions.length})</span>
          </h2>
        </div>

        {redemptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {redemptions.map((r) => (
              <GuestRedemptionVoucher key={r._id} redemption={{ ...r, reward: r.rewardId || r.reward }} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-[#e4d3c2] shadow-[0_10px_30px_-10px_rgba(46,26,16,0.06)]">
            <div className="w-14 h-14 rounded-2xl bg-[#fdfaf6] border border-[#e4d3c2] flex items-center justify-center mx-auto mb-3 text-primary">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg text-on-surface font-bold">No Active Vouchers Yet</h3>
            <p className="text-xs sm:text-sm text-[#3b241a] font-medium mt-1 max-w-md mx-auto leading-relaxed">
              Complete your 5 seals on the digital Maharaja Card to unlock your choice of an exquisite fine dining dish or chef special.
            </p>
          </div>
        )}
      </div>

      {/* Available Rewards Catalog — Choose 1 perk */}
      {rewards.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#eee0d2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black text-[#1d0f09] uppercase tracking-[0.18em] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center text-[#744d1c]">
                  <Gift className="w-3.5 h-3.5" />
                </div>
                <span>Imperial Rewards Catalog</span>
              </h2>
              {canChooseOneReward ? (
                <p className="text-xs text-primary font-bold mt-1">
                  ★ Select your complimentary dish or privilege below (1 voucher per completed card)
                </p>
              ) : (
                <p className="text-xs text-[#3b241a] font-medium mt-1">
                  Preview the exclusive delicacies unlocked after completing your 5 seals
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rewards.map((r) => (
              <RewardCard
                key={r._id}
                reward={r}
                isRedeemable={canChooseOneReward}
                onRedeem={canChooseOneReward ? () => handleClaimReward(r) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Program Terms & Conditions — Accessible but visually secondary */}
      <div className="pt-4">
        <ProgramTermsCard defaultOpen={false} />
      </div>
    </div>
  );
}
