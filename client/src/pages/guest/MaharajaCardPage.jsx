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
        <div className="h-80 skeleton rounded-2xl" />
        <div className="h-20 skeleton rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-deep-brown/50 mb-4">{error}</p>
        <button onClick={loadCard} className="btn-royal text-sm">Try Again</button>
      </div>
    );
  }

  const { card, availableRedemptions, isComplete } = data || {};

  return (
    <div className="space-y-6 animate-slideUp">
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
        <div className="bg-white rounded-2xl p-5 shadow-royal">
          <h3 className="font-serif text-lg text-deep-brown mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-royal-gold" /> Available Rewards
          </h3>
          <div className="space-y-3">
            {availableRedemptions.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3 bg-cream rounded-xl">
                <div>
                  <p className="font-medium text-deep-brown text-sm">{r.rewardId?.title}</p>
                  <p className="text-xs text-deep-brown/40">{r.rewardId?.description}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">Available</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reward Unlocked Animation */}
      {isComplete && (
        <div className="bg-gradient-to-br from-royal-gold/10 to-royal-rose/10 rounded-2xl p-6 text-center border border-royal-gold/20">
          <h3 className="font-serif text-xl text-deep-brown mb-2">🎉 Royal Reward Unlocked!</h3>
          <p className="text-sm text-deep-brown/60 mb-4">Your Maharaja Card is complete. View your reward below.</p>
          <Link to="/rewards" className="btn-gold text-sm no-underline inline-flex items-center gap-2">
            View Reward <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Info */}
      <div className="bg-white rounded-xl p-4 text-center">
        <p className="text-xs text-deep-brown/40">
          Stamps are verified and approved by our staff during your visit.
        </p>
      </div>
    </div>
  );
}
