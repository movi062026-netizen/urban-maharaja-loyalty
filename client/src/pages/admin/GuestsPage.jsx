import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Users, Search, ChevronLeft, ChevronRight, Eye, Phone, Mail, Calendar, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => { loadGuests(); }, [pagination.page]);

  const loadGuests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getGuests({ page: pagination.page, limit: 20, search });
      setGuests(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      toast.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    loadGuests();
  };

  const viewDetail = async (id) => {
    try {
      const res = await adminApi.getGuestDetail(id);
      setDetail(res.data.data);
      setSelectedGuest(id);
    } catch (err) {
      toast.error('Failed to load guest details');
    }
  };

  const maskPhone = (phone) => phone ? `${phone.slice(0, 4)}****${phone.slice(-2)}` : '—';

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-on-surface font-bold">Royal Patron Registry</h1>
          <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
            Oversee court members, active Maharaja passes, and dining milestones
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, email, or mobile number..."
            className="w-full pl-10 pr-4 py-3 bg-surface-container/90 border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Table Container */}
      <div className="glass-panel-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-xs uppercase tracking-wider text-secondary">
                <th className="text-left px-5 py-3.5 font-semibold">Noble Patron</th>
                <th className="text-left px-5 py-3.5 font-semibold">Contact (Email / Mobile)</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Last Visit</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Inducted</th>
                <th className="text-center px-5 py-3.5 font-semibold">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant/50">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading patron roster...</span>
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant/50">
                    No noble patrons found matching your search.
                  </td>
                </tr>
              ) : guests.map((g) => (
                <tr key={g._id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-on-surface">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                        {g.name?.charAt(0) || 'G'}
                      </div>
                      <span>{g.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs font-mono">
                    <div>{g.email || '—'}</div>
                    <div className="text-[11px] text-on-surface-variant/60">{g.phone ? maskPhone(g.phone) : ''}</div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant/70 text-xs hidden md:table-cell">
                    {g.lastLoginAt ? new Date(g.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant/70 text-xs hidden md:table-cell">
                    {new Date(g.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => viewDetail(g._id)}
                      className="p-2 rounded-lg bg-surface-container-high/80 hover:bg-primary-container/30 text-primary border border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer"
                      aria-label={`View dossier for ${g.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-outline-variant/30 bg-surface-container-lowest/40">
            <span className="text-xs text-on-surface-variant">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total members)
            </span>
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

      {/* Guest Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4" onClick={() => setDetail(null)}>
          <div
            className="bg-surface-container rounded-3xl p-6 sm:p-7 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-outline-variant/40 shadow-2xl animate-scaleIn text-on-surface"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Patron Dossier"
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                  {detail.guest?.name?.charAt(0) || 'G'}
                </div>
                <div>
                  <h2 className="font-serif text-xl text-on-surface font-bold">{detail.guest?.name}</h2>
                  <span className="text-xs text-secondary font-mono uppercase tracking-wider">Noble Patron Dossier</span>
                </div>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-xs">
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase tracking-wider mb-0.5">Email</span>
                <span className="text-on-surface font-mono font-medium">{detail.guest?.email || '—'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase tracking-wider mb-0.5">Mobile</span>
                <span className="text-on-surface font-mono font-medium">{detail.guest?.phone || '—'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase tracking-wider mb-0.5">Member Since</span>
                <span className="text-on-surface font-mono font-medium">
                  {new Date(detail.guest?.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase tracking-wider mb-0.5">Status</span>
                <span className="text-green-400 font-semibold uppercase tracking-wider text-[11px]">Active Court Member</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif font-bold text-on-surface text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Maharaja Passes ({detail.cards?.length || 0})</span>
              </h3>
              <div className="space-y-2">
                {detail.cards?.map((c) => (
                  <div key={c._id} className="bg-surface-container-high/80 rounded-xl p-3 border border-outline-variant/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-on-surface">Cycle #{c.cycleNumber}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {c.currentStamps} of {c.targetStamps} Seals Collected
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      c.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-primary-container/20 text-primary border-primary/30'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="font-serif font-bold text-on-surface text-sm flex items-center gap-2 pt-2">
                <Users className="w-4 h-4 text-secondary" />
                <span>Recent Seals History ({detail.stamps?.length || 0})</span>
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {detail.stamps?.length === 0 ? (
                  <p className="text-xs text-on-surface-variant/50 italic py-2">No seal history on record.</p>
                ) : (
                  detail.stamps?.slice(0, 10).map((s) => (
                    <div key={s._id} className="bg-surface-container-high/60 rounded-lg p-2.5 border border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                      <span className={`text-[11px] font-bold ${
                        s.status === 'APPROVED' ? 'text-green-400' : s.status === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {s.status}
                      </span>
                      <span className="text-on-surface-variant text-[11px]">
                        {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
