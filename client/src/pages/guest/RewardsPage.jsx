import { useState, useEffect } from 'react';
import { rewardApi } from '../../services/api';
import { Gift, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  AVAILABLE: { label: 'Available', icon: Gift, color: 'text-success bg-success/10' },
  REDEEMED: { label: 'Redeemed', icon: CheckCircle, color: 'text-deep-brown/40 bg-warm-beige/50' },
  EXPIRED: { label: 'Expired', icon: XCircle, color: 'text-error bg-error/10' },
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
        {[1, 2, 3].map((i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      <h1 className="font-serif text-2xl text-deep-brown">Your Rewards</h1>

      {/* My Redemptions */}
      {redemptions.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-deep-brown/50 uppercase tracking-widest">Your Rewards</h2>
          {redemptions.map((r) => {
            const config = statusConfig[r.status] || statusConfig.AVAILABLE;
            const Icon = config.icon;
            return (
              <div key={r._id} className="bg-white rounded-xl p-4 shadow-royal">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-deep-brown">{r.rewardId?.title}</h3>
                    <p className="text-xs text-deep-brown/40 mt-1">{r.rewardId?.description}</p>
                    {r.expiresAt && r.status === 'AVAILABLE' && (
                      <p className="text-xs text-warning mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Valid until {new Date(r.expiresAt).toLocaleDateString('en-IN')}
                      </p>
                    )}
                    {r.redeemedAt && (
                      <p className="text-xs text-deep-brown/30 mt-2">
                        Redeemed on {new Date(r.redeemedAt).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
                    <Icon className="w-3 h-3" /> {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center shadow-royal">
          <Gift className="w-10 h-10 text-warm-beige mx-auto mb-3" />
          <h3 className="font-serif text-lg text-deep-brown mb-2">No Rewards Yet</h3>
          <p className="text-sm text-deep-brown/40">Complete your Maharaja Card to unlock rewards!</p>
        </div>
      )}

      {/* Available Rewards Info */}
      {rewards.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-deep-brown/50 uppercase tracking-widest mb-3">Available Rewards</h2>
          <div className="space-y-3">
            {rewards.map((r) => (
              <div key={r._id} className="bg-cream-dark rounded-xl p-4 border border-warm-beige/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-deep-brown text-sm">{r.title}</h3>
                    <p className="text-xs text-deep-brown/40 mt-0.5">{r.description}</p>
                  </div>
                  <span className="text-xs text-royal-gold font-medium whitespace-nowrap">
                    {r.requiredStamps} stamps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
