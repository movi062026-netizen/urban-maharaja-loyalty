import { useState, useEffect } from 'react';
import { loyaltyApi } from '../../services/api';
import { History, Crown, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await loyaltyApi.getMyHistory();
      setHistory(res.data.data.history || []);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const stampIcon = (status) => {
    if (status === 'APPROVED') return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === 'REJECTED') return <XCircle className="w-4 h-4 text-error" />;
    return <Clock className="w-4 h-4 text-warning" />;
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      <h1 className="font-serif text-2xl text-deep-brown">Visit History</h1>

      {history.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-royal">
          <History className="w-10 h-10 text-warm-beige mx-auto mb-3" />
          <h3 className="font-serif text-lg text-deep-brown mb-2">No History Yet</h3>
          <p className="text-sm text-deep-brown/40">Your visit history will appear here.</p>
        </div>
      ) : (
        history.map(({ card, stamps, redemptions }) => (
          <div key={card._id} className="bg-white rounded-2xl p-5 shadow-royal">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-warm-beige">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-royal-gold" />
                <h2 className="font-serif text-lg text-deep-brown">Cycle {card.cycleNumber}</h2>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                card.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                card.status === 'ACTIVE' ? 'bg-royal-gold/10 text-royal-gold' :
                'bg-warm-beige text-deep-brown/40'
              }`}>
                {card.status}
              </span>
            </div>

            <p className="text-sm text-deep-brown/50 mb-3">
              {card.currentStamps} / {card.targetStamps} stamps
            </p>

            {/* Stamps */}
            <div className="space-y-2">
              {stamps.map((stamp) => (
                <div key={stamp._id} className="flex items-center justify-between py-2 px-3 bg-cream rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    {stampIcon(stamp.status)}
                    <span className="text-deep-brown/70">{stamp.status}</span>
                  </div>
                  <span className="text-xs text-deep-brown/30">
                    {new Date(stamp.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Redemptions */}
            {redemptions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-warm-beige">
                {redemptions.map((r) => (
                  <div key={r._id} className="flex items-center justify-between text-sm">
                    <span className="text-deep-brown/60">{r.rewardId?.title}</span>
                    <span className={`text-xs ${r.status === 'REDEEMED' ? 'text-success' : 'text-warning'}`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
