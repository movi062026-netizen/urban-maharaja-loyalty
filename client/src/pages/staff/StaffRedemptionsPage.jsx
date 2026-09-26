import { useState, useEffect } from 'react';
import { adminApi, rewardApi } from '../../services/api';
import { ShoppingBag, ChevronLeft, ChevronRight, CheckCircle, Gift, Search } from 'lucide-react';
import StaffRedemptionScanner from '../../components/staff/StaffRedemptionScanner';
import toast from 'react-hot-toast';

export default function StaffRedemptionsPage() {
  const [redemptions, setRedemptions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRedemptions();
  }, [pagination.page]);

  const loadRedemptions = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getRedemptions({ page: pagination.page, limit: 20 });
      setRedemptions(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      toast.error('Failed to load redemptions');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (id) => {
    if (!window.confirm('Confirm redemption of this royal dining voucher for the guest?')) return;
    try {
      await rewardApi.redeemReward(id);
      toast.success('Reward voucher redeemed successfully!');
      loadRedemptions();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to redeem');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Voucher Redemption Desk</h1>
        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
          Verify and honor reward vouchers presented by dining patrons at their table
        </p>
      </div>

      {/* Interactive Voucher Scanner / Passcode Entry */}
      <StaffRedemptionScanner onRedemptionComplete={loadRedemptions} />

      <div className="glass-panel-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-xs uppercase tracking-wider text-secondary">
                <th className="text-left px-5 py-3.5 font-semibold">Noble Patron</th>
                <th className="text-left px-5 py-3.5 font-semibold">Reward Item</th>
                <th className="text-left px-5 py-3.5 font-semibold">Voucher Status</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Redeemed By</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Date</th>
                <th className="text-center px-5 py-3.5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-on-surface-variant/50">
                    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading voucher records...</span>
                  </td>
                </tr>
              ) : redemptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-on-surface-variant/50">
                    No redemption vouchers recorded.
                  </td>
                </tr>
              ) : redemptions.map((r) => (
                <tr key={r._id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-on-surface">
                    {r.guestId?.name || (r.guestId?.email ? r.guestId.email.split('@')[0] : 'Noble Patron')}
                  </td>
                  <td className="px-5 py-4 text-on-surface font-medium">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-secondary" />
                      <span>{r.rewardId?.title || 'Royal Dish'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {r.status === 'REDEEMED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                        Redeemed
                      </span>
                    ) : r.status === 'AVAILABLE' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary/20 text-secondary border border-secondary/30">
                        Ready to Claim
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs hidden md:table-cell">
                    {r.redeemedBy?.name || '—'}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs font-mono hidden md:table-cell">
                    {r.redeemedAt ? new Date(r.redeemedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {r.status === 'AVAILABLE' ? (
                      <button
                        onClick={() => handleRedeem(r._id)}
                        className="px-3.5 py-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl text-xs font-bold hover:bg-green-500/30 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Redeem</span>
                      </button>
                    ) : (
                      <span className="text-xs text-on-surface-variant/40 font-mono">—</span>
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
