import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { loyaltyApi } from '../../services/api';
import MaharajaCard from '../../components/loyalty/MaharajaCard';
import { Gift, ArrowRight, Stamp, Sparkles, CheckCircle2, ShieldCheck, History, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GuestTierBadge from '../../components/guest/GuestTierBadge';
import GuestStampTracker from '../../components/guest/GuestStampTracker';
import RequestStampModal from '../../components/guest/RequestStampModal';

export default function MaharajaCardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestingStamp, setRequestingStamp] = useState(false);
  const [startingCycle, setStartingCycle] = useState(false);
  const [selectedCycleIndex, setSelectedCycleIndex] = useState(0);
  const [billModalOpen, setBillModalOpen] = useState(false);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    try {
      setLoading(true);
      const res = await loyaltyApi.getMyCard();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load Maharaja Card');
      toast.error('Failed to load your Maharaja Card');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBillModal = () => {
    setBillModalOpen(true);
  };

  const handleSubmitBill = async (formData) => {
    setRequestingStamp(true);
    try {
      await loyaltyApi.requestMyStamp(formData);
      toast.success('Royal dining bill uploaded & seal requested! Concierge will verify your visit.');
      setBillModalOpen(false);
      loadCard();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to submit bill');
    } finally {
      setRequestingStamp(false);
    }
  };

  const handleStartNextCycle = async () => {
    setStartingCycle(true);
    try {
      await loyaltyApi.startNextCycle();
      toast.success('New Maharaja Card cycle activated! Enjoy your dining.');
      loadCard();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to activate next cycle');
    } finally {
      setStartingCycle(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-64 sm:h-80 rounded-3xl bg-surface-container/60 border border-outline-variant/30" />
          <div className="h-28 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-44 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
          <div className="h-44 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 p-8 rounded-3xl bg-surface-container/80 border border-outline-variant/30 text-on-surface">
        <p className="text-on-surface-variant text-sm mb-4">{error}</p>
        <button
          onClick={loadCard}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { card, allCards = [], stamps = [], availableRedemptions = [], isComplete, totalCompletedCycles = 0, totalApprovedStamps = 0 } = data || {};
  const activeCycle = card?.cycleNumber || 1;
  const isCardFinished = (card?.currentStamps || 0) >= (card?.targetStamps || 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 text-on-surface"
    >
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/20">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold">
            Digital Maharaja Card
          </h1>
          <p className="text-xs text-on-surface-variant mt-1 font-sans">
            Welcome, <strong className="text-secondary">{user?.name || 'Noble Patron'}</strong>. Present your card during dining to collect seals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-mono text-secondary font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Cycle #{activeCycle} Active</span>
          </span>
          <button
            onClick={loadCard}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title="Refresh Card"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Imperial Tier Badge Banner */}
      <GuestTierBadge totalApprovedStamps={totalApprovedStamps} />

      {/* Main Grid: Left Card & Stamp Tracker, Right Cycles & Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Card & Stamp Tracker (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-center">
            <MaharajaCard
              guestName={user?.name}
              currentStamps={card?.currentStamps}
              targetStamps={card?.targetStamps}
              cycleNumber={card?.cycleNumber}
              isComplete={isComplete || isCardFinished}
            />
          </div>

          {/* Interactive Stamp & Seal Collection Tracker */}
          <GuestStampTracker
            currentStamps={card?.currentStamps || 0}
            targetStamps={card?.targetStamps || 5}
            cycleNumber={card?.cycleNumber || 1}
            pendingStamp={data?.pendingStamp}
            onRequestStamp={handleOpenBillModal}
            requesting={requestingStamp}
            isComplete={isCardFinished}
          />

          {/* Quick Bridge to Dedicated Stamp & Seal Desk */}
          <div className="p-4 rounded-2xl bg-white border border-[#e0c8b0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">
                  Dedicated Stamp & Seal Desk
                </p>
                <p className="text-[11px] text-on-surface-variant/80">
                  Submit dining bills, track real-time concierge approvals, and inspect milestone perks.
                </p>
              </div>
            </div>
            <Link
              to="/guest/stamps"
              className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-xs no-underline flex items-center gap-1.5 shrink-0"
            >
              <span>Open Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cycle Completed Milestone Celebration */}
          {isCardFinished && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-container/20 via-surface-container to-secondary/20 border border-primary/40 backdrop-blur-xl shadow-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-container/30 border border-primary/50 flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-on-surface">
                🎉 Royal Cycle #{activeCycle} Completed!
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                You have collected all 5 royal seals! Your royal complimentary reward voucher has been unlocked and added to your rewards vault.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/guest/rewards"
                  className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs uppercase tracking-wider font-bold hover:brightness-110 shadow no-underline inline-flex items-center gap-1.5"
                >
                  <Gift className="w-4 h-4" />
                  <span>Claim Your Reward</span>
                </Link>
                <button
                  onClick={handleStartNextCycle}
                  disabled={startingCycle}
                  className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-secondary text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>{startingCycle ? 'Activating...' : `Begin Royal Cycle #${activeCycle + 1}`}</span>
                </button>
              </div>
            </div>
          )}

          {/* Loyalty Stats Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e0c8b0] shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/80 block mb-1">
                Current Seals
              </span>
              <span className="text-xl sm:text-2xl font-serif font-black text-primary">
                {card?.currentStamps || 0} / {card?.targetStamps || 5}
              </span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e0c8b0] shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/80 block mb-1">
                Completed Cards
              </span>
              <span className="text-xl sm:text-2xl font-serif font-black text-secondary">
                {totalCompletedCycles} Passes
              </span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e0c8b0] shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/80 block mb-1">
                Total Visits
              </span>
              <span className="text-xl sm:text-2xl font-serif font-black text-on-surface">
                {totalApprovedStamps} Seals
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Cycle Progression & Rewards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* How Card Cycles Work */}
          <div className="p-6 rounded-3xl bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)]">
            <h3 className="font-serif text-base font-bold text-on-surface mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Maharaja Card Cycle Progression</span>
            </h3>
            <p className="text-xs text-on-surface-variant/80 leading-relaxed mb-4">
              Every 5 dining visits completes a full cycle and awards an exclusive fine-dining perk. Once completed, your pass rolls over into Cycle 2, Cycle 3, and beyond with higher privileges!
            </p>

            {/* Cycle History Badges */}
            <div className="space-y-2">
              {allCards.map((c) => (
                <div
                  key={c._id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    c.status === 'ACTIVE'
                      ? 'bg-primary-container/10 border-primary/30 text-on-surface'
                      : 'bg-[#fdfaf6] border-[#ede0d2] text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      {c.status === 'ACTIVE' ? 'military_tech' : 'check_circle'}
                    </span>
                    <span className="font-bold text-on-surface">Cycle #{c.cycleNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold">{c.currentStamps}/{c.targetStamps} Seals</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      c.status === 'ACTIVE'
                        ? 'bg-primary-container text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Rewards Vault */}
          <div className="p-6 rounded-3xl bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-on-surface flex items-center gap-2">
                <Gift className="w-4 h-4 text-secondary" />
                <span>Unlocked Reward Vouchers</span>
              </h3>
              <Link to="/guest/rewards" className="text-xs text-primary hover:text-primary-container transition-colors no-underline font-bold">
                View All →
              </Link>
            </div>

            {availableRedemptions.length === 0 ? (
              <div className="p-5 rounded-2xl bg-[#fdfaf6] border border-[#ede0d2] text-center">
                <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                  No unredeemed vouchers at this moment. Complete your 5 seals to unlock your complimentary royal treat!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableRedemptions.map((r) => (
                  <div
                    key={r._id}
                    className="p-3.5 rounded-2xl bg-[#fdfaf6] border border-[#ede0d2] hover:border-primary/40 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-bold text-on-surface text-xs">{r.rewardId?.title || 'Complimentary Perk'}</p>
                      <p className="text-[11px] text-on-surface-variant/80 mt-0.5">{r.rewardId?.description || 'Valid on your next dine-in'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold uppercase">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill Upload & Stamp Request Modal */}
      <RequestStampModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onSubmit={handleSubmitBill}
        submitting={requestingStamp}
      />
    </motion.div>
  );
}
