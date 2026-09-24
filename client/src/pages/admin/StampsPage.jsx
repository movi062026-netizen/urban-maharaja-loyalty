import { useState, useEffect } from 'react';
import { adminApi, loyaltyApi } from '../../services/api';
import { Stamp as StampIcon, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StampsPage() {
  const [stamps, setStamps] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  // Staff stamp panel
  const [searchPhone, setSearchPhone] = useState('');
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
    if (!searchPhone) return;
    setSearching(true);
    try {
      const res = await loyaltyApi.searchGuest(searchPhone);
      setGuestResult(res.data.data);
    } catch (err) {
      toast.error('Failed to search guest');
    } finally {
      setSearching(false);
    }
  };

  const handleRequestStamp = async (guestId) => {
    try {
      await loyaltyApi.requestStamp(guestId);
      toast.success('Stamp requested');
      setGuestResult(null);
      setSearchPhone('');
      loadStamps();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to request stamp');
    }
  };

  const handleApprove = async (stampId) => {
    if (!window.confirm('Approve this stamp?')) return;
    try {
      await loyaltyApi.approveStamp(stampId);
      toast.success('Stamp approved');
      loadStamps();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to approve');
    }
  };

  const handleReject = async (stampId) => {
    const reason = window.prompt('Reason for rejection (optional):');
    try {
      await loyaltyApi.rejectStamp(stampId, reason || undefined);
      toast.success('Stamp rejected');
      loadStamps();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to reject');
    }
  };

  const statusIcon = (status) => {
    if (status === 'APPROVED') return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === 'REJECTED') return <XCircle className="w-4 h-4 text-error" />;
    return <Clock className="w-4 h-4 text-warning" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="font-serif text-2xl text-deep-brown">Stamp Management</h1>

      {/* Staff Stamp Panel */}
      <div className="bg-white rounded-xl p-5 shadow-royal">
        <h2 className="font-serif text-lg text-deep-brown mb-3">Verify Guest Visit</h2>
        <form onSubmit={handleSearchGuest} className="flex gap-2 mb-4">
          <input
            type="tel"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="Guest phone number..."
            className="flex-1 px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50"
          />
          <button type="submit" disabled={searching} className="btn-royal text-sm px-5">
            {searching ? '...' : 'Search'}
          </button>
        </form>

        {guestResult && (
          <div className="bg-cream rounded-xl p-4 animate-scaleIn">
            {guestResult.guest ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-deep-brown">{guestResult.guest.name}</p>
                    <p className="text-xs text-deep-brown/40">{guestResult.guest.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-royal-gold">
                      {guestResult.loyalty?.card?.currentStamps} / {guestResult.loyalty?.card?.targetStamps}
                    </p>
                    <p className="text-xs text-deep-brown/40">stamps</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRequestStamp(guestResult.guest._id)}
                  className="btn-gold w-full text-sm py-2.5"
                >
                  <StampIcon className="w-4 h-4 inline mr-1" /> Approve Stamp for This Visit
                </button>
              </div>
            ) : (
              <p className="text-sm text-deep-brown/40 text-center">Guest not found</p>
            )}
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === status ? 'bg-royal-rose text-white' : 'bg-white text-deep-brown/60 hover:bg-cream'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-royal overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-beige bg-cream">
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Guest</th>
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Status</th>
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden md:table-cell">Approved By</th>
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden md:table-cell">Date</th>
                <th className="text-center px-4 py-3 font-medium text-deep-brown/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-deep-brown/30">Loading...</td></tr>
              ) : stamps.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-deep-brown/30">No stamps found</td></tr>
              ) : stamps.map((s) => (
                <tr key={s._id} className="border-b border-warm-beige/50 hover:bg-cream/50">
                  <td className="px-4 py-3">{s.guestId?.name || '—'}</td>
                  <td className="px-4 py-3 flex items-center gap-1.5">
                    {statusIcon(s.status)} {s.status}
                  </td>
                  <td className="px-4 py-3 text-deep-brown/40 hidden md:table-cell">{s.approvedBy?.name || '—'}</td>
                  <td className="px-4 py-3 text-deep-brown/40 hidden md:table-cell">
                    {new Date(s.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.status === 'PENDING' && (
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => handleApprove(s._id)} className="px-2 py-1 bg-success/10 text-success rounded text-xs hover:bg-success/20">Approve</button>
                        <button onClick={() => handleReject(s._id)} className="px-2 py-1 bg-error/10 text-error rounded text-xs hover:bg-error/20">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-warm-beige">
            <span className="text-xs text-deep-brown/40">Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page <= 1} className="p-1.5 rounded-lg border border-warm-beige hover:bg-cream disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))} disabled={pagination.page >= pagination.totalPages} className="p-1.5 rounded-lg border border-warm-beige hover:bg-cream disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
