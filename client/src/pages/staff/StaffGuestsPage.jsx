import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Search, ChevronLeft, ChevronRight, Eye, ShieldCheck, Stamp } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function StaffGuestsPage() {
  const [guests, setGuests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuests();
  }, [pagination.page]);

  const loadGuests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getGuests({ page: pagination.page, limit: 20, search });
      setGuests(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      toast.error('Failed to load guest directory');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    loadGuests();
  };

  const maskPhone = (phone) => phone ? `${phone.slice(0, 4)}****${phone.slice(-2)}` : '—';

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Patron Lookup &amp; Directory</h1>
        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
          Look up dining patrons by name, email, or mobile to verify membership status
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, email, or mobile number..."
            className="w-full pl-10 pr-4 py-3 bg-surface-container/90 border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary via-[#f3d3aa] to-primary-container text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Directory Table */}
      <div className="glass-panel-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-xs uppercase tracking-wider text-secondary">
                <th className="text-left px-5 py-3.5 font-semibold">Noble Patron</th>
                <th className="text-left px-5 py-3.5 font-semibold">Contact (Email / Mobile)</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Last Visit</th>
                <th className="text-center px-5 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-on-surface-variant/50">
                    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading patron roster...</span>
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-on-surface-variant/50">
                    No patrons found matching your search.
                  </td>
                </tr>
              ) : guests.map((g) => (
                <tr key={g._id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-on-surface">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-xs">
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
                    {g.lastLoginAt ? new Date(g.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link
                      to={`/staff/stamps?guest=${encodeURIComponent(g.email || g.phone || g.name)}`}
                      className="px-3.5 py-1.5 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 text-xs font-bold no-underline inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Stamp className="w-3.5 h-3.5" />
                      <span>Issue Seal</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
}
