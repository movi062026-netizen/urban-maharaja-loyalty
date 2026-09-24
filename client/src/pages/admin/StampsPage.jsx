import { useState, useEffect } from 'react';
import { adminApi, loyaltyApi } from '../../services/api';
import { Stamp as StampIcon, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StampsPage() {
  const [stamps, setStamps] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Staff stamp panel
  const [searchQuery, setSearchQuery] = useState('');
  const [guestResult, setGuestResult] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => { loadStamps(); }, [pagination.page, statusFilter]);

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

  const handleSearchGuest = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await loyaltyApi.searchGuest(searchQuery.trim());
      setGuestResult(res.data.data);
      if (!res.data.data?.guest) {
        toast.error('No guest found with those credentials');
      }
    } catch (err) {
      toast.error('Failed to search guest record');
    } finally {
      setSearching(false);
    }
  };

  const handleRequestStamp = async (guestId) => {
    try {
      await loyaltyApi.requestStamp(guestId);
      toast.success('Royal seal requested and recorded!');
      setGuestResult(null);
      setSearchQuery('');
      loadStamps();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to request seal');
    }
  };

  const handleApprove = async (stampId) => {
    if (!window.confirm('Approve this royal dining seal?')) return;
    try {
      await loyaltyApi.approveStamp(stampId);
      toast.success('Royal seal approved!');
      loadStamps();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to approve');
    }
  };

  const handleReject = async (stampId) => {
    const reason = window.prompt('Reason for rejection (optional):');
    try {
      await loyaltyApi.rejectStamp(stampId, reason || undefined);
      toast.success('Seal rejected');
      loadStamps();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to reject');
    }
  };

  const statusBadge = (status) => {
    if (status === 'APPROVED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
          <CheckCircle className="w-3.5 h-3.5" /> Approved
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Stamp &amp; Seal Station</h1>
        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
          Validate dining visits, approve seals on guest Maharaja Cards, and track audit history
        </p>
      </div>

      {/* Staff Stamp Validation Panel */}
      <div className="bg-surface-container/85 rounded-2xl p-6 border border-outline-variant/40 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary">
            <StampIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-on-surface font-bold">Validate Guest Dining Visit</h2>
            <p className="text-xs text-on-surface-variant">Find guest by email or phone to grant their royal seal</p>
          </div>
        </div>

        <form onSubmit={handleSearchGuest} className="flex gap-2.5 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter guest email (e.g. patron@...) or mobile number..."
              className="w-full pl-10 pr-4 py-3 bg-surface-container-high/90 border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer disabled:opacity-50"
          >
            {searching ? 'Locating...' : 'Locate Guest'}
          </button>
        </form>

        {guestResult && (
          <div className="mt-4 p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 animate-scaleIn">
            {guestResult.guest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                      {guestResult.guest.name?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">{guestResult.guest.name}</p>
                      <p className="text-xs text-on-surface-variant font-mono">
                        {guestResult.guest.email || guestResult.guest.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-serif font-bold text-secondary">
                      {guestResult.loyalty?.card?.currentStamps || 0} / {guestResult.loyalty?.card?.targetStamps || 5}
                    </span>
                    <p className="text-[11px] text-on-surface-variant uppercase tracking-wider">Seals Collected</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRequestStamp(guestResult.guest._id)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary via-[#f3d3aa] to-primary-container text-surface-container-lowest text-xs uppercase tracking-widest font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <StampIcon className="w-4 h-4" />
                  <span>Grant Royal Seal for This Visit</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant/70 text-center py-2">No guest patron matched this query.</p>
            )}
          </div>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2">
        {['', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-primary-container text-surface-container-lowest shadow'
                : 'bg-surface-container/70 text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            {status || 'All Statuses'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container/85 rounded-2xl border border-outline-variant/30 backdrop-blur-xl shadow-lg overflow-hidden">
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
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading seal logs...</span>
                  </td>
                </tr>
              ) : stamps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant/50">
                    No seal requests found.
                  </td>
                </tr>
              ) : stamps.map((s) => (
                <tr key={s._id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-on-surface">
                    {s.guestId?.name || '—'}
                  </td>
                  <td className="px-5 py-4">
                    {statusBadge(s.status)}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs hidden md:table-cell">
                    {s.approvedBy?.name || '—'}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs font-mono hidden md:table-cell">
                    {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {s.status === 'PENDING' ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(s._id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold hover:bg-green-500/30 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(s._id)}
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
              ))}
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
    </div>
  );
}
