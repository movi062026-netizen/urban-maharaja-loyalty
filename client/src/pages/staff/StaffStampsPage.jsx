import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { adminApi, loyaltyApi } from '../../services/api';
import { Stamp as StampIcon, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Users, Sparkles, Eye, X, Image as ImageIcon } from 'lucide-react';
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
  const [selectedBill, setSelectedBill] = useState(null);

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
      const res = await loyaltyApi.requestStamp(guestId);
      const stampId = res.data?.data?.stamp?._id;
      if (stampId) {
        await loyaltyApi.approveStamp(stampId);
      }
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

  const handleModalConfirm = async (payload) => {
    try {
      const res = await loyaltyApi.requestStamp(payload);
      const stampId = res.data?.data?.stamp?._id;
      if (stampId) {
        await loyaltyApi.approveStamp(stampId);
      }
      toast.success('Royal seal verified and recorded with bill details!');
      setStampModalOpen(false);
      setGuestResult(null);
      setSearchQuery('');
      loadStamps();
      loadPendingRequests();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to grant seal');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6 animate-fadeIn text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Floor Stamp &amp; Seal Desk</h1>
        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
          Fast concierge station to validate patron dining visits and credit Digital Maharaja Cards
        </p>
      </div>

      {/* Live Table Request Queue */}
      <StaffLiveQueue
        pendingRequests={pendingRequests}
        onApprove={handleApprovePending}
        onReject={handleRejectPending}
      />

      {/* Floor Stamping Panel — Palace Porcelain Aesthetic */}
      <div className="glass-panel-elevated p-5 sm:p-7 space-y-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c99a4e] via-[#deb268] to-[#996d2b] p-[2px] shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-[#d4a66a]/40 text-[#9b284e]">
              <StampIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl text-on-surface font-bold">Validate Guest Dining Visit</h2>
            <p className="text-xs text-on-surface-variant font-medium">Search patron record or select active table guest to credit their royal seals</p>
          </div>
        </div>

        {/* Quick Select Buttons — Luminous Palace Pills */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-secondary font-bold block mb-2.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Active Patrons in Dining Room:</span>
          </span>
          <div className="flex flex-wrap gap-2.5">
            {recentGuests.map((g) => (
              <button
                key={g._id}
                type="button"
                onClick={() => handleSelectRecentGuest(g)}
                className="px-3.5 py-2 rounded-2xl bg-white border border-[#e2d2c2] hover:border-primary hover:bg-[#fffbf6] text-on-surface shadow-[0_2px_8px_rgba(46,26,20,0.04)] hover:shadow-[0_4px_16px_rgba(155,40,78,0.12)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 group"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white border border-primary/20 flex items-center justify-center text-[10px] font-bold transition-colors">
                  {(g.name || 'G').charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-xs text-on-surface">{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar — High-Contrast Porcelain & Royal Button */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patron email (patron@...), mobile (98765...), or name..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-[#e2d0bd] rounded-2xl text-on-surface placeholder-[#8c7465] text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-[#b8335f] to-primary-container text-white text-xs uppercase tracking-widest font-black shadow-[0_6px_20px_-3px_rgba(155,40,78,0.45)] hover:shadow-[0_10px_26px_-3px_rgba(155,40,78,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {searching ? 'Locating...' : 'Locate Patron'}
          </button>
        </form>

        {/* Found Result Card */}
        {guestResult && (
          <div className="p-6 rounded-2xl bg-white border-2 border-secondary/40 shadow-lg animate-scaleIn">
            {guestResult.guest ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-base shadow-sm">
                      {(guestResult.guest.name || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-serif font-bold text-on-surface text-lg leading-tight">{guestResult.guest.name}</p>
                      <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                        {guestResult.guest.email || guestResult.guest.phone || 'Court Patron'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-black text-secondary">
                      {guestResult.loyalty?.card?.currentStamps || 0} / {guestResult.loyalty?.card?.targetStamps || 5}
                    </span>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                      Cycle #{guestResult.loyalty?.card?.cycleNumber || 1} Pass
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleGrantStamp(guestResult.guest._id)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-secondary to-[#c29b38] text-white text-xs uppercase tracking-widest font-black shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <StampIcon className="w-4 h-4" />
                    <span>Instant 1-Click Seal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStampModalOpen(true)}
                    className="px-6 py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-primary/40 text-primary text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Attach Dining Bill...</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant text-center py-2">No guest patron matched this query.</p>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs — Segmented Luxury Control */}
      <div className="inline-flex p-1.5 rounded-2xl bg-[#eee3d4] border border-[#ddcfbe] shadow-inner gap-1">
        {['', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-white text-primary shadow-sm border border-[#ddcfbe]/70'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
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
                <th className="text-left px-5 py-3.5 font-semibold">Dining Bill</th>
                <th className="text-left px-5 py-3.5 font-semibold">Verification Seal</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Authorized Officer</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Visit Timestamp</th>
                <th className="text-center px-5 py-3.5 font-semibold">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant">
                    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading seal logs...</span>
                  </td>
                </tr>
              ) : stamps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant">
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
                            <p className="text-[11px] text-on-surface-variant font-mono font-normal mt-0.5">
                              {guestContact}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {s.billUrl ? (
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedBill({ url: s.billUrl, guestName, billNumber: s.billNumber, billAmount: s.billAmount })}
                            className="w-10 h-10 rounded-lg border border-primary/40 overflow-hidden bg-surface-container hover:scale-105 transition-all cursor-pointer shrink-0"
                            title="Inspect WebP Bill"
                          >
                            <img src={s.billUrl} alt="Bill" className="w-full h-full object-cover" />
                          </button>
                          <div className="text-[11px] font-mono leading-tight">
                            {s.billNumber && <p className="text-secondary font-semibold">#{s.billNumber}</p>}
                            {s.billAmount !== undefined && <p className="text-on-surface">₹{s.billAmount}</p>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant font-mono">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {s.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-600 border border-green-500/30">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : s.status === 'REJECTED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600 border border-red-500/30">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-500/30">
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
                            className="px-3 py-1.5 rounded-lg bg-green-100 text-green-600 border border-green-500/30 text-xs font-bold hover:bg-green-500/30 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPending(s._id)}
                            className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant font-mono">—</span>
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

      {/* Bill Lightbox Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-surface-container/95 border border-primary/40 p-4 sm:p-6 shadow-[0_24px_60px_rgba(46,26,20,0.15)] text-on-surface flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-3">
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  Dining Receipt: {selectedBill.guestName}
                </h3>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  {selectedBill.billNumber ? `Invoice #${selectedBill.billNumber}` : 'WebP Image Receipt'}
                  {selectedBill.billAmount ? ` • ₹${selectedBill.billAmount}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-surface-container-high/80 p-2 flex items-center justify-center">
              <img
                src={selectedBill.url}
                alt="Enlarged Bill Receipt"
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-on-surface-variant">
              <span className="font-mono text-[10px]">Cloudinary WebP Format</span>
              <a
                href={selectedBill.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline font-semibold"
              >
                Open Full Original ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
