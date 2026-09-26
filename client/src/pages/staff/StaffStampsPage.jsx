import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi, loyaltyApi } from '../../services/api';
import { Stamp as StampIcon, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Users, Sparkles } from 'lucide-react';
import StaffLiveQueue from '../../components/staff/StaffLiveQueue';
import StaffStampModal from '../../components/staff/StaffStampModal';
import toast from 'react-hot-toast';

export default function StaffStampsPage() {
  const [searchParams] = useSearchParams();
  const guestQueryParam = searchParams.get('guest');

  const [stamps, setStamps] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Active / Recent guests for quick 1-click stamping
  const [recentGuests, setRecentGuests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState(guestQueryParam || '');
  const [guestResult, setGuestResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [stampModalOpen, setStampModalOpen] = useState(false);

  useEffect(() => {
    loadStamps();
    loadRecentPatrons();
    loadPendingRequests();
    if (guestQueryParam) {
      executeSearch(guestQueryParam);
    }
  }, [pagination.page, statusFilter]);

  const loadStamps = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStamps({ page: pagination.page, limit: 20, status: statusFilter || undefined });
      setStamps(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      toast.error('Failed to load stamps');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPatrons = async () => {
    try {
      const res = await adminApi.getGuests({ page: 1, limit: 8 });
      setRecentGuests(res.data.data || []);
    } catch (err) {
      // Non-fatal
    }
  };

  const loadPendingRequests = async () => {
    try {
      const res = await adminApi.getStamps({ status: 'PENDING', limit: 10 });
      setPendingRequests(res.data.data || []);
    } catch (err) {
      // Non-fatal
    }
  };

  const executeSearch = async (term) => {
    if (!term || !term.trim()) return;
    setSearching(true);
    try {
      const res = await loyaltyApi.searchGuest(term.trim());
      setGuestResult(res.data.data);
      if (res.data.data?.guest) {
        toast.success(`Loaded card for ${res.data.data.guest.name}`);
      } else {
        toast.error('No patron found');
      }
    } catch (err) {
      toast.error('Failed to search guest');
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleSelectRecentGuest = (g) => {
    const val = g.email || g.phone || g.name;
    setSearchQuery(val);
    executeSearch(val);
  };

  const handleGrantStamp = async (guestId) => {
    try {
      await loyaltyApi.requestStamp(guestId);
      toast.success('Royal seal granted and verified for this visit!');
      setGuestResult(null);
      setSearchQuery('');
      loadStamps();
      loadPendingRequests();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to grant seal');
    }
  };

  const handleApprovePending = async (stampId) => {
    try {
      await loyaltyApi.approveStamp(stampId);
      toast.success('Table seal approved!');
      loadStamps();
      loadPendingRequests();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to approve');
    }
  };

  const handleRejectPending = async (stampId) => {
    const reason = window.prompt('Reason for rejection (optional):');
    try {
      await loyaltyApi.rejectStamp(stampId, reason || undefined);
      toast.success('Seal rejected');
      loadStamps();
      loadPendingRequests();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to reject');
    }
  };

  const handleModalConfirm = async ({ guestId }) => {
    try {
      await loyaltyApi.requestStamp(guestId);
      toast.success('Royal seal granted and registered!');
      setStampModalOpen(false);
      loadStamps();
      loadPendingRequests();
      if (searchQuery) executeSearch(searchQuery);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to grant seal');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Floor Stamp &amp; Seal Desk</h1>
        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
          Fast concierge station to validate patron dining visits and credit Digital Maharaja Cards
        </p>
      </div>

      {/* Live Table Request Queue */}
      <StaffLiveQueue pendingRequests={pendingRequests} onApprove={handleApprovePending} />

      {/* Floor Stamping Panel */}
      <div className="glass-panel-elevated p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
            <StampIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-on-surface font-bold">Validate Guest Dining Visit</h2>
            <p className="text-xs text-on-surface-variant">Grant official seal to dining guest</p>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-secondary font-semibold block mb-2">
            Active Patrons in Dining Room:
          </span>
          <div className="flex flex-wrap gap-2">
            {recentGuests.map((g) => (
              <button
                key={g._id}
                type="button"
                onClick={() => handleSelectRecentGuest(g)}
                className="px-3 py-1.5 rounded-xl bg-surface-container-high/80 hover:bg-secondary/20 border border-outline-variant/30 text-xs text-on-surface hover:text-secondary transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-5 h-5 rounded-full bg-secondary/30 text-secondary flex items-center justify-center text-[10px] font-bold">
                  {(g.name || 'G').charAt(0).toUpperCase()}
                </span>
                <span className="font-medium">{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patron email (e.g. patron@...), mobile (98765...), or name..."
              className="w-full pl-10 pr-4 py-3 bg-surface-container-high/90 border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary via-[#f3d3aa] to-primary-container text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer disabled:opacity-50"
          >
            {searching ? 'Locating...' : 'Locate Patron'}
          </button>
        </form>

        {/* Found Result Card */}
        {guestResult && (
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 animate-scaleIn">
            {guestResult.guest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-sm">
                      {(guestResult.guest.name || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface text-base">{guestResult.guest.name}</p>
                      <p className="text-xs text-on-surface-variant font-mono">
                        {guestResult.guest.email || guestResult.guest.phone || 'Court Patron'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-serif font-bold text-secondary">
                      {guestResult.loyalty?.card?.currentStamps || 0} / {guestResult.loyalty?.card?.targetStamps || 5}
                    </span>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                      Cycle #{guestResult.loyalty?.card?.cycleNumber || 1} Pass
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleGrantStamp(guestResult.guest._id)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-secondary to-[#c29b38] text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <StampIcon className="w-4 h-4" />
                    <span>Instant Seal (1-Click)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStampModalOpen(true)}
                    className="px-4 py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-on-surface text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Table Note...</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant/70 text-center py-2">No guest patron matched this query.</p>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-secondary text-surface-container-lowest shadow font-bold'
                : 'bg-surface-container/70 text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            {status || 'All Verified Seals'}
          </button>
        ))}
      </div>

      {/* Stamps Log Table */}
      <div className="glass-panel-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-xs uppercase tracking-wider text-secondary">
                <th className="text-left px-5 py-3.5 font-semibold">Guest Patron</th>
                <th className="text-left px-5 py-3.5 font-semibold">Verification Seal</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Authorized Officer</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Visit Timestamp</th>
                <th className="text-center px-5 py-3.5 font-semibold">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant/50">
                    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading seal logs...</span>
                  </td>
                </tr>
              ) : stamps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant/50">
                    No seal requests found.
                  </td>
                </tr>
              ) : stamps.map((s) => {
                const guestName = s.guestId?.name || (s.guestId?.email ? s.guestId.email.split('@')[0] : 'Noble Patron');
                const guestContact = s.guestId?.email || s.guestId?.phone || '';
                return (
                  <tr key={s._id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="px-5 py-4 font-semibold text-on-surface">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-xs">
                          {guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface leading-tight">{guestName}</p>
                          {guestContact && (
                            <p className="text-[11px] text-on-surface-variant/70 font-mono font-normal mt-0.5">
                              {guestContact}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {s.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : s.status === 'REJECTED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant text-xs hidden md:table-cell">
                      {s.approvedBy?.name || 'Concierge'}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant text-xs font-mono hidden md:table-cell">
                      {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {s.status === 'PENDING' ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleApprovePending(s._id)}
                            className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold hover:bg-green-500/30 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPending(s._id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant/50 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-outline-variant/30 bg-surface-container-lowest/40">
            <span className="text-xs text-on-surface-variant">Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Note & Details Modal */}
      <StaffStampModal
        isOpen={stampModalOpen}
        guest={guestResult?.guest}
        onClose={() => setStampModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}
