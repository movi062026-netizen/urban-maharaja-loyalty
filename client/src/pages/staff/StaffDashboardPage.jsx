import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi, loyaltyApi } from '../../services/api';
import { Stamp, ShoppingBag, Users, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StaffLiveQueue from '../../components/staff/StaffLiveQueue';
import toast from 'react-hot-toast';

export default function StaffDashboardPage() {
  const [stats, setStats] = useState(null);
  const [pendingStamps, setPendingStamps] = useState([]);
  const [recentGuests, setRecentGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, pendingRes, guestsRes] = await Promise.all([
        adminApi.getDashboard().catch(() => ({ data: { data: {} } })),
        adminApi.getStamps({ status: 'PENDING', limit: 8 }).catch(() => ({ data: { data: [] } })),
        adminApi.getGuests({ page: 1, limit: 6 }).catch(() => ({ data: { data: [] } })),
      ]);

      setStats(dashRes.data?.data || {});
      setPendingStamps(pendingRes.data?.data || []);
      setRecentGuests(guestsRes.data?.data || []);
    } catch (err) {
      toast.error('Failed to load concierge data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (stampId) => {
    try {
      await loyaltyApi.approveStamp(stampId);
      toast.success('Royal seal verified and granted!');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to approve');
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 sm:space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 sm:h-28 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
          ))}
        </div>
        <div className="h-48 sm:h-64 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
      </div>
    );
  }

  const { todayVisits = 0, activeGuests = 0, totalRedemptions = 0 } = stats;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-5 sm:space-y-7 text-on-surface"
      aria-label="Staff Dashboard"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-outline-variant/20">
        <header>
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold">
            Concierge Floor Terminal
          </h1>
          <p className="text-[10px] sm:text-xs text-on-surface-variant mt-1 font-sans">
            Oversee active dining guests, validate visits, and grant digital Maharaja seals
          </p>
        </header>
        <Link
          to="/staff/stamps"
          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl glass-btn-primary text-[10px] sm:text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 no-underline w-fit"
        >
          <Stamp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Open Stamp Desk</span>
        </Link>
      </div>

      {/* Live Floor Queue */}
      <StaffLiveQueue pendingRequests={pendingStamps} onApprove={handleApprove} />

      {/* Operational Stats Cards — Palace Porcelain Metric Suite */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e8d8c8] shadow-[0_12px_32px_-8px_rgba(46,26,16,0.06)] hover:shadow-[0_16px_40px_-8px_rgba(46,26,16,0.12)] hover:-translate-y-1 transition-all flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-secondary font-bold block mb-1">
              Today's Dining Visits
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-black text-[#1d0f09]">
              {todayVisits || pendingStamps.length}
            </span>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">Validated seals today</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c99a4e]/20 to-[#996d2b]/10 border border-[#d4a66a]/40 flex items-center justify-center text-secondary shrink-0 shadow-sm">
            <Stamp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e8d8c8] shadow-[0_12px_32px_-8px_rgba(46,26,16,0.06)] hover:shadow-[0_16px_40px_-8px_rgba(46,26,16,0.12)] hover:-translate-y-1 transition-all flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-primary font-bold block mb-1">
              Active Court Patrons
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-black text-[#9b284e]">
              {activeGuests || recentGuests.length}
            </span>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">Enrolled royal members</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e8d8c8] shadow-[0_12px_32px_-8px_rgba(46,26,16,0.06)] hover:shadow-[0_16px_40px_-8px_rgba(46,26,16,0.12)] hover:-translate-y-1 transition-all flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-green-700 font-bold block mb-1">
              Perks Claimed
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-black text-green-700">
              {totalRedemptions || 0}
            </span>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">Completed dining honors</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-500/30 flex items-center justify-center text-green-600 shrink-0 shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Recent Guests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel-elevated p-4 sm:p-5">
            <h2 className="font-serif text-sm sm:text-base font-bold text-on-surface mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
              <span>Floor Quick Actions</span>
            </h2>
            <div className="space-y-2 sm:space-y-2.5">
              <Link
                to="/staff/stamps"
                className="p-3 sm:p-3.5 rounded-xl glass-table-row hover:bg-surface-container-highest border border-outline-variant/20 flex items-center justify-between no-underline text-on-surface transition-all group"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                    <Stamp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold truncate">Validate Patron Stamp</p>
                    <p className="text-[9px] sm:text-[11px] text-on-surface-variant truncate">Search by mobile or email</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-surface-variant group-hover:text-secondary transition-colors shrink-0" />
              </Link>

              <Link
                to="/staff/redemptions"
                className="p-3 sm:p-3.5 rounded-xl glass-table-row hover:bg-surface-container-highest border border-outline-variant/20 flex items-center justify-between no-underline text-on-surface transition-all group"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold truncate">Redeem Guest Voucher</p>
                    <p className="text-[9px] sm:text-[11px] text-on-surface-variant truncate">Check and claim unlocked reward</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-surface-variant group-hover:text-green-600 transition-colors shrink-0" />
              </Link>

              <Link
                to="/staff/guests"
                className="p-3 sm:p-3.5 rounded-xl glass-table-row hover:bg-surface-container-highest border border-outline-variant/20 flex items-center justify-between no-underline text-on-surface transition-all group"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold truncate">Patron Lookup & Dossiers</p>
                    <p className="text-[9px] sm:text-[11px] text-on-surface-variant truncate">Check card cycle & seals</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Recent Dining Patrons (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel-elevated p-4 sm:p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 pb-2 border-b border-outline-variant/20 gap-2">
                <h2 className="font-serif text-sm sm:text-base font-bold text-on-surface flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span>Recent Enrolled Patrons</span>
                </h2>
                <Link to="/staff/guests" className="text-[10px] sm:text-xs text-secondary hover:text-primary transition-colors no-underline font-semibold">
                  All Patrons →
                </Link>
              </div>

              <div className="space-y-2">
                {recentGuests.length === 0 ? (
                  <p className="text-xs text-on-surface-variant/60 py-6 text-center">No patrons enrolled yet.</p>
                ) : (
                  recentGuests.map((g) => (
                    <div
                      key={g._id}
                      className="p-2.5 sm:p-3 rounded-xl glass-table-row flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full glass-chip-rose flex items-center justify-center text-primary font-bold text-[10px] sm:text-xs shrink-0">
                          {(g.name || 'G').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-on-surface text-[10px] sm:text-xs truncate">{g.name}</p>
                          <p className="text-[9px] sm:text-[11px] text-on-surface-variant font-mono truncate">
                            {g.email || g.phone || 'Court Member'}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/staff/stamps?guest=${encodeURIComponent(g.email || g.phone || g.name)}`}
                        className="px-2.5 sm:px-3 py-1 rounded-lg glass-btn-secondary text-[9px] sm:text-xs font-semibold no-underline flex items-center gap-1 shrink-0"
                      >
                        <span>Stamp</span>
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
