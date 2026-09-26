import { useState, useEffect } from 'react';
import { rewardApi } from '../../services/api';
import { Gift, Sparkles } from 'lucide-react';
import GuestRedemptionVoucher from '../../components/guest/GuestRedemptionVoucher';
import RewardCard from '../../components/rewards/RewardCard';
import toast from 'react-hot-toast';

export default function RewardsPage() {
  const [redemptions, setRedemptions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [redemptionsRes, rewardsRes] = await Promise.all([
        rewardApi.getMyRedemptions(),
        rewardApi.getActiveRewards(),
      ]);
      setRedemptions(redemptionsRes.data.data.redemptions || []);
      setRewards(rewardsRes.data.data.rewards || []);
    } catch (err) {
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slideUp text-on-surface">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-secondary font-bold">
            Guest Privileges
          </span>
        </div>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold">Your Royal Rewards</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Special culinary delights, vintage treats, and imperial dining honors unlocked with your stamps
        </p>
      </div>

      {/* Active Unlocked Vouchers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Active Honors &amp; Vouchers ({redemptions.length})</span>
          </h2>
        </div>

        {redemptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redemptions.map((r) => (
              <GuestRedemptionVoucher key={r._id} redemption={{ ...r, reward: r.rewardId || r.reward }} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container/60 rounded-3xl p-8 text-center border border-outline-variant/30 backdrop-blur-md">
            <Gift className="w-10 h-10 text-primary/40 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-on-surface font-semibold">No Vouchers Unlocked Yet</h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
              Collect 5 royal stamps on your digital Maharaja Card to unlock complimentary dining vouchers.
            </p>
          </div>
        )}
      </div>

      {/* Available Rewards Catalog */}
      {rewards.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-outline-variant/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-secondary" />
              <span>Imperial Rewards Catalog</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((r) => (
              <RewardCard
                key={r._id}
                reward={r}
                userStamps={5}
                onRedeem={() => toast.success(`To unlock "${r.title}", complete your 5-seal dining card!`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
