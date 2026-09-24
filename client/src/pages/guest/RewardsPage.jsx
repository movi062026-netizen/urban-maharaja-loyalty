import { useState, useEffect } from 'react';
import { rewardApi } from '../../services/api';
import { Gift, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  AVAILABLE: { label: 'Available', icon: Gift, color: 'text-green-300 bg-green-500/20 border-green-500/30' },
  REDEEMED: { label: 'Redeemed', icon: CheckCircle, color: 'text-on-surface-variant bg-surface-container-high border-outline-variant/30' },
  EXPIRED: { label: 'Expired', icon: XCircle, color: 'text-red-300 bg-red-500/20 border-red-500/30' },
};

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
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Your Royal Rewards</h1>
        <p className="text-xs text-on-surface-variant mt-1">Special delights and imperial dining honors unlocked with your stamps</p>
      </div>

      {/* My Redemptions */}
      {redemptions.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest">Active Honors &amp; Vouchers</h2>
          {redemptions.map((r) => {
            const config = statusConfig[r.status] || statusConfig.AVAILABLE;
            const Icon = config.icon;
            return (
              <div key={r._id} className="bg-surface-container/85 rounded-2xl p-5 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-base text-on-surface font-bold">{r.rewardId?.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{r.rewardId?.description}</p>
                    {r.expiresAt && r.status === 'AVAILABLE' && (
                      <p className="text-xs text-amber-300/90 mt-2.5 flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        Valid until {new Date(r.expiresAt).toLocaleDateString('en-IN')}
                      </p>
                    )}
                    {r.redeemedAt && (
                      <p className="text-[11px] text-on-surface-variant/60 mt-2 font-mono">
                        Honored on {new Date(r.redeemedAt).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 shrink-0 ${config.color}`}>
                    <Icon className="w-3 h-3" /> {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-container/60 rounded-3xl p-8 text-center border border-outline-variant/30 backdrop-blur-md">
          <Gift className="w-10 h-10 text-primary/40 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-on-surface font-semibold">No Vouchers Yet</h3>
          <p className="text-xs text-on-surface-variant mt-1">Complete your Maharaja Card to unlock complimentary royal courses!</p>
        </div>
      )}

      {/* Available Rewards Catalog */}
      {rewards.length > 0 && (
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest">Imperial Reward Catalog</h2>
          <div className="space-y-3">
            {rewards.map((r) => (
              <div key={r._id} className="bg-surface-container/85 rounded-2xl p-4.5 border border-outline-variant/30 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-sm text-on-surface font-bold">{r.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{r.description}</p>
                </div>
                <span className="text-xs text-primary font-mono font-bold whitespace-nowrap px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30">
                  {r.requiredStamps} stamps
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
