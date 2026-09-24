import { useState, useEffect } from 'react';
import { adminApi, rewardApi } from '../../services/api';
import { ShoppingBag, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRedemptions(); }, [pagination.page]);

  const loadRedemptions = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getRedemptions({ page: pagination.page, limit: 20 });
      setRedemptions(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) { toast.error('Failed to load redemptions'); }
    finally { setLoading(false); }
  };

  const handleRedeem = async (id) => {
    if (!window.confirm('Confirm reward redemption?')) return;
    try {
      await rewardApi.redeemReward(id);
      toast.success('Reward redeemed successfully');
      loadRedemptions();
    } catch (err) { toast.error(err.response?.data?.error?.message || 'Failed to redeem'); }
  };

  const statusColor = (s) => s === 'REDEEMED' ? 'bg-success/10 text-success' : s === 'AVAILABLE' ? 'bg-royal-gold/10 text-royal-gold' : 'bg-error/10 text-error';

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="font-serif text-2xl text-deep-brown">Redemption Management</h1>
      <div className="bg-white rounded-xl shadow-royal overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-warm-beige bg-cream">
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Guest</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Reward</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Status</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden md:table-cell">Redeemed By</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden md:table-cell">Date</th>
              <th className="text-center px-4 py-3 font-medium text-deep-brown/60">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-deep-brown/30">Loading...</td></tr>
              ) : redemptions.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-deep-brown/30">No redemptions found</td></tr>
              ) : redemptions.map((r) => (
                <tr key={r._id} className="border-b border-warm-beige/50 hover:bg-cream/50">
                  <td className="px-4 py-3">{r.guestId?.name || '—'}</td>
                  <td className="px-4 py-3">{r.rewardId?.title || '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(r.status)}`}>{r.status}</span></td>
                  <td className="px-4 py-3 text-deep-brown/40 hidden md:table-cell">{r.redeemedBy?.name || '—'}</td>
                  <td className="px-4 py-3 text-deep-brown/40 hidden md:table-cell">{r.redeemedAt ? new Date(r.redeemedAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {r.status === 'AVAILABLE' && (
                      <button onClick={() => handleRedeem(r._id)} className="px-3 py-1 bg-success/10 text-success rounded text-xs hover:bg-success/20 flex items-center gap-1 mx-auto">
                        <CheckCircle className="w-3 h-3" /> Redeem
                      </button>
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
