import { useState, useEffect } from 'react';
import { adminApi, loyaltyApi } from '../../services/api';
import { Stamp, ShoppingBag, Users, Clock, CheckCircle, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
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
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
      </div>
    );
  }

  const { todayVisits = 0, activeGuests = 0, totalRedemptions = 0 } = stats;

  return (
    <div className="space-y-7 animate-fadeIn text-on-surface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/20">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold">
            Concierge Floor Terminal
          </h1>
          <p className="text-xs text-on-surface-variant mt-1 font-sans">
            Oversee active dining guests, validate visits, and grant digital Maharaja seals
          </p>
        </div>
        <Link
          to="/staff/stamps"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary via-[#f3d3aa] to-primary-container text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-2 no-underline"
        >
          <Stamp className="w-4 h-4" />
          <span>Open Stamp Desk</span>
        </Link>
      </div>

      {/* Live Floor Queue */}
      <StaffLiveQueue pendingRequests={pendingStamps} onApprove={handleApprove} />

      {/* Operational Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container/85 rounded-2xl p-5 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
              Today's Dining Visits
            </span>
            <span className="font-serif text-3xl font-bold text-secondary">
              {todayVisits || pendingStamps.length}
            </span>
            <p className="text-[11px] text-on-surface-variant/70 mt-1">Validated seals today</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
            <Stamp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface-container/85 rounded-2xl p-5 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
              Active Court Patrons
            </span>
            <span className="font-serif text-3xl font-bold text-primary">
              {activeGuests || recentGuests.length}
            </span>
            <p className="text-[11px] text-on-surface-variant/70 mt-1">Enrolled members</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface-container/85 rounded-2xl p-5 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
              Perks Claimed
            </span>
            <span className="font-serif text-3xl font-bold text-green-400">
              {totalRedemptions || 0}
            </span>
            <p className="text-[11px] text-on-surface-variant/70 mt-1">Completed redemptions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Recent Guests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-surface-container/85 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
            <h2 className="font-serif text-base font-bold text-on-surface mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Floor Quick Actions</span>
            </h2>
            <div className="space-y-2.5">
              <Link
                to="/staff/stamps"
                className="p-3.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest border border-outline-variant/30 flex items-center justify-between no-underline text-on-surface transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                    <Stamp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Validate Patron Stamp</p>
                    <p className="text-[11px] text-on-surface-variant">Search by mobile or email</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </Link>

              <Link
                to="/staff/redemptions"
                className="p-3.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest border border-outline-variant/30 flex items-center justify-between no-underline text-on-surface transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Redeem Guest Voucher</p>
                    <p className="text-[11px] text-on-surface-variant">Check and claim unlocked reward</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-green-400 transition-colors" />
              </Link>

              <Link
                to="/staff/guests"
                className="p-3.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest border border-outline-variant/30 flex items-center justify-between no-underline text-on-surface transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Patron Lookup &amp; Dossiers</p>
                    <p className="text-[11px] text-on-surface-variant">Check card cycle &amp; seals</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Recent Dining Patrons (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-surface-container/85 border border-outline-variant/30 backdrop-blur-xl shadow-lg h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/20">
                <h2 className="font-serif text-base font-bold text-on-surface flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Recently Logged-In &amp; Enrolled Patrons</span>
                </h2>
                <Link to="/staff/guests" className="text-xs text-secondary hover:text-primary transition-colors no-underline">
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
                      className="p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/25 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                          {(g.name || 'G').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-xs">{g.name}</p>
                          <p className="text-[11px] text-on-surface-variant font-mono">
                            {g.email || g.phone || 'Court Member'}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/staff/stamps?guest=${encodeURIComponent(g.email || g.phone || g.name)}`}
                        className="px-3 py-1 rounded-lg bg-surface-container-highest hover:bg-secondary/20 text-secondary text-xs font-semibold no-underline transition-colors flex items-center gap-1"
                      >
                        <span>Stamp</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
