import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { loyaltyApi } from '../../services/api';
import {
  Stamp, Crown, CheckCircle2, Clock, Upload, ArrowRight,
  Sparkles, ShieldCheck, AlertCircle, RefreshCw, X, FileText,
  DollarSign, Hash, HelpCircle, Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GuestTierBadge from '../../components/guest/GuestTierBadge';

const sealMilestones = [
  {
    step: 1,
    title: 'First Royal Step',
    description: 'Welcome visit endorsed by floor concierge.',
    perk: 'Cycle Activated',
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
    shadow: '0 8px 24px -3px rgba(245, 158, 11, 0.4)',
    ring: 'rgba(217, 119, 6, 0.7)',
    textColor: '#78350f',
  },
  {
    step: 2,
    title: 'Culinary Devotion',
    description: 'Second dining feast verified with authentic seal.',
    perk: 'Loyalty Endorsement',
    bg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 50%, #fb7185 100%)',
    shadow: '0 8px 24px -3px rgba(251, 113, 133, 0.4)',
    ring: 'rgba(225, 29, 72, 0.7)',
    textColor: '#881337',
  },
  {
    step: 3,
    title: 'Noble Patron',
    description: 'Halfway mark achieved in your current royal cycle.',
    perk: 'Midpoint Milestone',
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)',
    shadow: '0 8px 24px -3px rgba(52, 211, 153, 0.4)',
    ring: 'rgba(5, 150, 105, 0.7)',
    textColor: '#064e3b',
  },
  {
    step: 4,
    title: 'Royal Ambassador',
    description: 'Just one seal away from unlocking your complimentary banquet reward!',
    perk: 'Pre-Reward Tier',
    bg: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 50%, #c084fc 100%)',
    shadow: '0 8px 24px -3px rgba(192, 132, 252, 0.4)',
    ring: 'rgba(147, 51, 234, 0.7)',
    textColor: '#581c87',
  },
  {
    step: 5,
    title: 'Maharaja Grand Feast',
    description: 'Final seal unlocked! Awards complimentary royal delicacy of your choice.',
    perk: 'Free Feast Reward',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef08a 45%, #eab308 100%)',
    shadow: '0 12px 28px -3px rgba(234, 179, 8, 0.55)',
    ring: 'rgba(202, 138, 4, 0.85)',
    textColor: '#713f12',
  },
];

export default function GuestStampsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [historyStamps, setHistoryStamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // In-page Bill Upload Form state
  const [billAmount, setBillAmount] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadStampData();
  }, []);

  const loadStampData = async () => {
    try {
      setLoading(true);
      const [cardRes, histRes] = await Promise.all([
        loyaltyApi.getMyCard(),
        loyaltyApi.getMyHistory().catch(() => ({ data: { data: { history: [] } } }))
      ]);
      setData(cardRes.data.data);
      setHistoryStamps(histRes.data?.data?.history?.filter((h) => h.type === 'STAMP') || []);
    } catch (err) {
      toast.error('Failed to load stamp data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStampData();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (PNG, JPG, WEBP)');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error('File size exceeds 8MB limit');
        return;
      }
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
      setReceiptPreview(null);
    }
  };

  const handleSubmitBill = async (e) => {
    e.preventDefault();
    if (!billAmount || Number(billAmount) <= 0) {
      toast.error('Please enter a valid bill amount');
      return;
    }
    if (!receiptFile) {
      toast.error('Please attach a photo of your dining bill or receipt');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('billAmount', billAmount);
      if (billNumber) formData.append('billNumber', billNumber);
      if (tableNumber) formData.append('tableNumber', tableNumber);
      if (notes) formData.append('notes', notes);

      await loyaltyApi.requestMyStamp(formData);
      toast.success('Royal dining receipt submitted! Floor concierge will review and verify.');

      // Reset form
      setBillAmount('');
      setBillNumber('');
      setTableNumber('');
      setNotes('');
      handleRemoveFile();

      // Refresh card state
      loadStampData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to submit bill');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-on-surface">
        <div className="h-28 rounded-3xl bg-white border border-[#e4d3c2]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 rounded-3xl bg-white border border-[#e4d3c2]" />
          <div className="lg:col-span-5 h-96 rounded-3xl bg-white border border-[#e4d3c2]" />
        </div>
      </div>
    );
  }

  const { card, stamps = [], pendingStamp = null, totalApprovedStamps = 0 } = data || {};
  const currentStamps = card?.currentStamps || 0;
  const targetStamps = card?.targetStamps || 5;
  const activeCycle = card?.cycleNumber || 1;
  const isComplete = currentStamps >= targetStamps;
  const stampsRemaining = Math.max(0, targetStamps - currentStamps);
  const progressPercent = Math.min(100, Math.round((currentStamps / targetStamps) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 text-on-surface"
    >
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#eee0d2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
              Concierge Verification Desk
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold flex items-center gap-2.5">
            <span>Stamp & Seal Tracker</span>
            <Stamp className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Upload dining bills, monitor official concierge approvals, and track your milestone journey toward the 5th stamp complimentary feast.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/guest/card"
            className="px-4 py-2 rounded-xl bg-[#fdfaf6] hover:bg-white border border-[#e0c8b0] text-xs font-bold text-on-surface hover:text-primary transition-all shadow-xs flex items-center gap-1.5 no-underline"
          >
            <span>View Maharaja Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white hover:bg-[#fdfaf6] border border-[#e0c8b0] text-on-surface-variant hover:text-primary transition-colors cursor-pointer shadow-xs"
            title="Refresh Stamps"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tier Badge Banner */}
      <GuestTierBadge totalApprovedStamps={totalApprovedStamps} />

      {/* Grand Cycle Milestone Board */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)] relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 via-amber-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-[11px] font-bold text-primary tracking-wide">
                  Cycle #{activeCycle} Active
                </span>
                <span className="text-xs font-mono text-on-surface-variant">
                  {currentStamps} of {targetStamps} Seals Collected
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mt-1.5">
                {isComplete ? '🎉 Royal Milestone Achieved!' : `${stampsRemaining} More ${stampsRemaining === 1 ? 'Seal' : 'Seals'} To Unlock Complimentary Feast`}
              </h2>
            </div>

            {/* Percentage pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-serif font-black text-primary block leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Completed</span>
              </div>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full h-3 rounded-full bg-[#f4ece3] p-0.5 border border-[#e5d5c5] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-[#ba3461] to-[#cca056] shadow-sm"
            />
          </div>

          {/* 5 Circular Stamp Milestones */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {sealMilestones.map((m, idx) => {
              const isCollected = idx < currentStamps;
              const isNext = idx === currentStamps && !isComplete;
              return (
                <div
                  key={m.step}
                  className={`p-4 rounded-2xl border transition-all duration-300 relative flex flex-col items-center text-center ${
                    isCollected
                      ? 'bg-gradient-to-b from-[#fffefc] to-[#fbf7f2] border-[#d8beaa] shadow-md'
                      : isNext
                      ? 'bg-white border-primary shadow-md ring-2 ring-primary/20'
                      : 'bg-[#faf6f1]/60 border-[#e9dcce]'
                  }`}
                >
                  {/* Seal Medallion */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3 relative transition-transform"
                    style={
                      isCollected
                        ? {
                            background: m.bg,
                            boxShadow: m.shadow,
                            border: `2px solid ${m.ring}`,
                            transform: 'scale(1.05)',
                          }
                        : isNext
                        ? {
                            background: 'white',
                            border: '2px dashed #ba3461',
                          }
                        : {
                            background: '#f2e8dc',
                            border: '1.5px dashed #d8c7b5',
                          }
                    }
                  >
                    {isCollected ? (
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-5 h-5" style={{ color: m.textColor }} />
                      </div>
                    ) : isNext ? (
                      <div className="flex flex-col items-center">
                        <Stamp className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-[9px] font-bold text-primary font-mono mt-0.5">NEXT</span>
                      </div>
                    ) : (
                      <span className="text-xs font-serif font-black text-on-surface-variant">
                        #{m.step}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold">
                    Seal #{m.step}
                  </span>
                  <h4 className="font-serif text-xs font-bold text-on-surface mt-0.5">
                    {m.title}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                    {m.perk}
                  </p>

                  {/* Status tag */}
                  <div className="mt-2.5">
                    {isCollected ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9px] font-bold uppercase tracking-wider">
                        Endorsed
                      </span>
                    ) : isNext ? (
                      <span className="px-2 py-0.5 rounded-full bg-primary-container text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/60 text-on-surface-variant border border-outline-variant/30 text-[9px] font-mono">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* If cycle complete, celebration banner */}
          {isComplete && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-container/15 via-[#cca056]/15 to-transparent border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-on-surface">
                    Royal Complimentary Feast Unlocked!
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Visit your rewards vault to redeem your voucher with the floor concierge.
                  </p>
                </div>
              </div>
              <Link
                to="/guest/rewards"
                className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold tracking-wider uppercase hover:brightness-110 shadow-xs no-underline flex items-center gap-2 shrink-0"
              >
                <Gift className="w-4 h-4" />
                <span>Claim Privilege</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout: Left Desk Upload / Live Verification, Right Active Cycle Stamped Visits & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Bill Upload Station & Live Verification Desk (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pending Verification Notice Card */}
          {pendingStamp ? (
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-50 to-[#fffbf2] border border-amber-300 shadow-sm text-on-surface relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-400 text-[10px] font-bold uppercase tracking-wider">
                      Concierge Review In Progress
                    </span>
                    <span className="text-[11px] font-mono text-amber-800/80">
                      {new Date(pendingStamp.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-amber-950">
                    Your Dining Bill Is Being Verified
                  </h3>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Our floor concierge captain reviews submitted dining bills during operational hours. Once approved, your #{currentStamps + 1} official seal will instantly appear on your pass.
                  </p>
                  <div className="p-3 rounded-xl bg-white/80 border border-amber-200 text-xs font-mono text-amber-950 flex flex-wrap items-center justify-between gap-2">
                    <span>Amount: <strong>₹{pendingStamp.billAmount || '—'}</strong></span>
                    {pendingStamp.billNumber && <span>Bill Ref: <strong>#{pendingStamp.billNumber}</strong></span>}
                    {pendingStamp.tableNumber && <span>Table: <strong>{pendingStamp.tableNumber}</strong></span>}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Interactive In-Page Bill Upload Desk */}
          <div className="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eee0d2]">
              <div>
                <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  <span>Submit Dining Bill for Stamp</span>
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Dined at Urban Maharaja? Upload your restaurant receipt to receive your official seal.
                </p>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                1 Seal / Visit
              </span>
            </div>

            <form onSubmit={handleSubmitBill} className="space-y-4">
              {/* Receipt Dropzone */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                  <span>Photo of Restaurant Bill / Receipt *</span>
                  <span className="text-[10px] font-normal text-on-surface-variant">JPG, PNG, WEBP (Max 8MB)</span>
                </label>

                {receiptPreview ? (
                  <div className="relative rounded-2xl border-2 border-primary/40 p-2 bg-[#fdfaf6] flex items-center gap-4">
                    <img
                      src={receiptPreview}
                      alt="Bill Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-outline-variant/40"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">
                        {receiptFile?.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                        {(receiptFile?.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove / Replace Image</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#d8beaa] hover:border-primary rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#faf6f1]/50 hover:bg-[#faf6f1] transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-[#e0c8b0] flex items-center justify-center text-primary mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-on-surface">
                      Click to browse or take a photo of your receipt
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      Ensure bill number, date, and final amount are clearly legible
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    <span>Bill Amount (₹) *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    placeholder="e.g. 1450"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8beaa] bg-white text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-secondary" />
                    <span>Bill Number (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    placeholder="e.g. UM-8492"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8beaa] bg-white text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Table / Section (Optional)
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 7 / Courtyard"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8beaa] bg-white text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Note for Concierge (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Family anniversary lunch"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8beaa] bg-white text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting Receipt to Concierge...</span>
                  </>
                ) : (
                  <>
                    <Stamp className="w-4 h-4" />
                    <span>Submit Dining Bill for Royal Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Stamped Visits in Current Cycle & Palace Protocols (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Cycle Stamped Visits */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-on-surface flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Seals in Cycle #{activeCycle}</span>
              </h3>
              <span className="text-xs font-mono font-bold text-primary">
                {currentStamps} / {targetStamps} Seals
              </span>
            </div>

            {currentStamps === 0 ? (
              <div className="p-4 sm:p-6 rounded-2xl bg-[#fdfaf6] border border-[#ede0d2] text-center space-y-2">
                <Stamp className="w-8 h-8 text-on-surface-variant mx-auto" />
                <p className="text-xs text-on-surface-variant font-bold">
                  No verified seals in this cycle yet
                </p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Upload your bill receipt or ask the floor captain to scan your QR pass at your table!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: currentStamps }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#fdfaf6] border border-[#ede0d2] hover:border-primary/40 flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold font-mono text-xs">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">
                          Official Royal Seal #{i + 1}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Endorsed by Palace Concierge
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold uppercase">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Palace Stamping Rules & FAQ */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)] space-y-4">
            <h3 className="font-serif text-base font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Palace Stamping Protocol</span>
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-on-surface-variant">
              <div className="p-3 rounded-xl bg-[#fdfaf6] border border-[#ede0d2]">
                <strong className="text-on-surface block mb-0.5">1 Seal Per Dine-In Visit</strong>
                <span>Each dining experience with a qualifying restaurant bill entitles your table to one official Maharaja seal.</span>
              </div>

              <div className="p-3 rounded-xl bg-[#fdfaf6] border border-[#ede0d2]">
                <strong className="text-on-surface block mb-0.5">Instant Table Stamping</strong>
                <span>Don't wish to upload a bill later? Simply show your digital card QR to the floor concierge or server for instant verification during payment.</span>
              </div>

              <div className="p-3 rounded-xl bg-[#fdfaf6] border border-[#ede0d2]">
                <strong className="text-on-surface block mb-0.5">5 Seals = Complimentary Feast</strong>
                <span>Upon collecting all 5 seals, your complimentary privilege voucher automatically unlocks in your Rewards Vault with a unique concierge passcode.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
