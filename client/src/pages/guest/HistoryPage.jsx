import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    if (status === 'APPROVED') return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    if (status === 'REJECTED') return <XCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-amber-600" />;
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-white border border-[#e4d3c2] shadow-xs" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 animate-slideUp text-on-surface"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eee0d2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
              Palace Archives
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold">Royal Visit Ledger</h1>
          <p className="text-xs text-on-surface-variant/80 mt-1">
            Chronological archive of all dining visits, official seals endorsed, and privileges claimed
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#e4d3c2] shadow-[0_10px_30px_-10px_rgba(46,26,16,0.06)]">
          <div className="w-14 h-14 rounded-2xl bg-[#fdfaf6] border border-[#e4d3c2] flex items-center justify-center mx-auto mb-3 text-primary">
            <History className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg text-on-surface font-bold">No Visit History Yet</h3>
          <p className="text-xs sm:text-sm text-on-surface-variant/80 mt-1 max-w-sm mx-auto leading-relaxed">
            Your imperial dining visits, stamps, and vouchers will be inscribed here automatically as you dine.
          </p>
        </div>
      ) : (
        history.map(({ card, stamps, redemptions }) => (
          <div
            key={card._id}
            className="rounded-[24px] bg-white border border-[#e4d3c2] shadow-[0_10px_32px_-10px_rgba(46,26,16,0.07)] p-5 sm:p-6 transition-all hover:shadow-[0_16px_40px_-10px_rgba(46,26,16,0.12)]"
          >
            {/* Cycle Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eee0d2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white shadow-xs">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-base sm:text-lg text-on-surface font-bold">
                    Maharaja Card Cycle #{card.cycleNumber}
                  </h2>
                  <p className="text-[11px] text-secondary font-mono font-semibold">
                    {card.currentStamps} of {card.targetStamps} Seals Collected
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${
                  card.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : card.status === 'ACTIVE'
                    ? 'bg-primary-container/10 text-primary border-primary/20'
                    : 'bg-stone-100 text-stone-600 border-stone-300'
                }`}
              >
                {card.status}
              </span>
            </div>

            {/* Seals Inscribed List */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70 block mb-1">
                Dining Seals Inscribed ({stamps.length})
              </span>
              {stamps.length === 0 ? (
                <p className="text-xs text-on-surface-variant/50 italic py-1">No seals requested yet in this cycle.</p>
              ) : (
                stamps.map((stamp) => (
                  <div
                    key={stamp._id}
                    className="flex items-center justify-between py-2.5 px-4 bg-[#fdfaf6] border border-[#ede0d2] rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {stampIcon(stamp.status)}
                      <span className="text-on-surface font-bold capitalize">{stamp.status.toLowerCase()}</span>
                      {stamp.billAmount && (
                        <span className="text-secondary font-mono font-semibold">₹{stamp.billAmount}</span>
                      )}
                      {stamp.approvedBy?.name && (
                        <span className="text-on-surface-variant/70 text-[11px]">
                          endorsed by {stamp.approvedBy.name}
                        </span>
                      )}
                    </div>
                    <span className="text-on-surface-variant/70 font-mono text-[11px]">
                      {new Date(stamp.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Redemptions Claimed In This Cycle */}
            {redemptions.length > 0 && (
              <div className="pt-3 border-t border-[#eee0d2] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-secondary block">
                  Reward Privileges Claimed In This Cycle
                </span>
                {redemptions.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between text-xs py-2 px-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">redeem</span>
                      <span className="text-on-surface font-bold">{r.rewardId?.title || 'Palace Treat'}</span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        r.status === 'REDEEMED'
                          ? 'text-emerald-700 bg-emerald-100 border border-emerald-300'
                          : 'text-amber-800 bg-amber-100 border border-amber-300'
                      }`}
                    >
                      {r.status === 'AVAILABLE' ? 'Ready to Claim' : r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </motion.div>
  );
}
