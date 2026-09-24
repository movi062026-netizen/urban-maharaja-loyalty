import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loyaltyApi } from '../../services/api';
import MaharajaCard from '../../components/loyalty/MaharajaCard';
import { Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MaharajaCardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    try {
      setLoading(true);
      const res = await loyaltyApi.getMyCard();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load card');
      toast.error('Failed to load your Maharaja Card');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 sm:h-72 rounded-3xl bg-surface-container/60 border border-outline-variant/30" />
        <div className="h-24 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 p-6 rounded-3xl bg-surface-container/80 border border-outline-variant/30">
        <p className="text-on-surface-variant text-sm mb-4">{error}</p>
        <button
          onClick={loadCard}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { card, availableRedemptions, isComplete } = data || {};

  return (
    <div className="space-y-6 animate-slideUp text-on-surface">
      {/* Maharaja Card */}
      <MaharajaCard
        guestName={user?.name}
        currentStamps={card?.currentStamps}
        targetStamps={card?.targetStamps}
        cycleNumber={card?.cycleNumber}
        isComplete={isComplete}
      />

      {/* Available Rewards */}
      {availableRedemptions?.length > 0 && (
        <div className="bg-surface-container/85 rounded-3xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
          <h3 className="font-serif text-lg text-on-surface mb-3 flex items-center gap-2 font-bold">
            <Gift className="w-5 h-5 text-primary" /> Available Rewards
          </h3>
          <div className="space-y-3">
            {availableRedemptions.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3.5 bg-surface-container-high/80 border border-outline-variant/30 rounded-xl">
                <div>
                  <p className="font-semibold text-on-surface text-sm">{r.rewardId?.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{r.rewardId?.description}</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full font-semibold">
                  Unlocked
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reward Unlocked Alert */}
      {isComplete && (
        <div className="bg-gradient-to-br from-primary-container/20 to-secondary/20 rounded-3xl p-6 text-center border border-primary/40 backdrop-blur-xl shadow-xl">
          <h3 className="font-serif text-xl text-primary font-bold mb-2">🎉 Royal Reward Unlocked!</h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mb-4">Your Maharaja Card cycle is complete. Claim your royal reward.</p>
          <Link
            to="/rewards"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 no-underline inline-flex items-center gap-2"
          >
            <span>View &amp; Redeem Reward</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Concierge Info Banner */}
      <div className="bg-surface-container/70 rounded-2xl p-4 text-center border border-outline-variant/30 backdrop-blur-md">
        <p className="text-xs text-on-surface-variant/80">
          Present your card to the royal staff during your meal to collect your stamps.
        </p>
      </div>
    </div>
  );
}
