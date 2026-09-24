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
        {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Royal Visit Ledger</h1>
        <p className="text-xs text-on-surface-variant mt-1">Chronological archive of all stamps collected and rewards claimed</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-surface-container/60 rounded-3xl p-8 text-center border border-outline-variant/30 backdrop-blur-md">
          <History className="w-10 h-10 text-primary/40 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-on-surface font-semibold">No Visit History Yet</h3>
          <p className="text-xs text-on-surface-variant mt-1">Your imperial dining visits will be inscribed here automatically.</p>
        </div>
      ) : (
        history.map(({ card, stamps, redemptions }) => (
          <div key={card._id} className="bg-surface-container/85 rounded-3xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-base text-on-surface font-bold">Card Cycle #{card.cycleNumber}</h2>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                card.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                card.status === 'ACTIVE' ? 'bg-primary-container/20 text-primary border-primary/30' :
                'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
              }`}>
                {card.status}
              </span>
            </div>

            <p className="text-xs text-secondary font-mono uppercase tracking-wider mb-3">
              Progress: {card.currentStamps} of {card.targetStamps} Seals Collected
            </p>

            {/* Stamps */}
            <div className="space-y-2">
              {stamps.map((stamp) => (
                <div key={stamp._id} className="flex items-center justify-between py-2.5 px-3.5 bg-surface-container-high/70 border border-outline-variant/20 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    {stampIcon(stamp.status)}
                    <span className="text-on-surface font-semibold capitalize">{stamp.status.toLowerCase()}</span>
                    {stamp.approvedBy?.name && (
                      <span className="text-on-surface-variant/70 text-[11px]">by {stamp.approvedBy.name}</span>
                    )}
                  </div>
                  <span className="text-on-surface-variant/60 font-mono text-[11px]">
                    {new Date(stamp.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Redemptions */}
            {redemptions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-outline-variant/30 space-y-1.5">
                <p className="text-[10px] uppercase font-mono tracking-wider text-secondary">Rewards Claimed In This Cycle</p>
                {redemptions.map((r) => (
                  <div key={r._id} className="flex items-center justify-between text-xs py-1">
                    <span className="text-on-surface font-medium">{r.rewardId?.title}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${r.status === 'REDEEMED' ? 'text-green-300 bg-green-500/10' : 'text-amber-300 bg-amber-500/10'}`}>
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
