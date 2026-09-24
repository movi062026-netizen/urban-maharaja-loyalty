import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Users, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-deep-brown">Guest Management</h1>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-brown/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 text-sm"
          />
        </div>
        <button type="submit" className="btn-royal text-sm px-5">Search</button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-royal overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-warm-beige bg-cream">
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Name</th>
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden md:table-cell">Last Login</th>
                <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden md:table-cell">Joined</th>
                <th className="text-center px-4 py-3 font-medium text-deep-brown/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-deep-brown/30">Loading...</td></tr>
              ) : guests.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-deep-brown/30">No guests found</td></tr>
              ) : guests.map((g) => (
                <tr key={g._id} className="border-b border-warm-beige/50 hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-deep-brown">{g.name}</td>
                  <td className="px-4 py-3 text-deep-brown/60">{maskPhone(g.phone)}</td>
                  <td className="px-4 py-3 text-deep-brown/40 hidden md:table-cell">
                    {g.lastLoginAt ? new Date(g.lastLoginAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 text-deep-brown/40 hidden md:table-cell">
                    {new Date(g.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => viewDetail(g._id)} className="p-1.5 rounded-lg hover:bg-royal-rose/10 text-royal-rose transition-colors" aria-label={`View ${g.name}`}>
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-warm-beige">
            <span className="text-xs text-deep-brown/40">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-warm-beige hover:bg-cream disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-warm-beige hover:bg-cream disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guest Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-royal-lg animate-scaleIn" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Guest Detail">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-deep-brown">{detail.guest?.name}</h2>
              <button onClick={() => setDetail(null)} className="text-deep-brown/30 hover:text-deep-brown text-lg">✕</button>
            </div>
            <div className="space-y-2 text-sm text-deep-brown/60 mb-4">
              <p>Phone: {maskPhone(detail.guest?.phone)}</p>
              <p>Joined: {new Date(detail.guest?.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-deep-brown text-sm">Loyalty Cards ({detail.cards?.length})</h3>
              {detail.cards?.map((c) => (
                <div key={c._id} className="bg-cream rounded-lg p-3 text-xs">
                  <span>Cycle {c.cycleNumber}: {c.currentStamps}/{c.targetStamps} stamps — {c.status}</span>
                </div>
              ))}
              <h3 className="font-medium text-deep-brown text-sm mt-3">Stamps ({detail.stamps?.length})</h3>
              {detail.stamps?.slice(0, 10).map((s) => (
                <div key={s._id} className="bg-cream rounded-lg p-3 text-xs flex justify-between">
                  <span>{s.status}</span>
                  <span>{new Date(s.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
