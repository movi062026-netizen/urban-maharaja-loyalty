import { useState } from 'react';
import { Gift, CheckCircle2, AlertCircle, ScanLine } from 'lucide-react';
import { loyaltyApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function StaffRedemptionScanner({ onRedemptionComplete }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRedeemed, setLastRedeemed] = useState(null);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter a voucher code');
      return;
    }

    setLoading(true);
    try {
      const res = await loyaltyApi.redeemReward(code.trim().toUpperCase());
      const data = res.data.data;
      setLastRedeemed(data);
      setCode('');
      toast.success('Reward voucher successfully redeemed!');
      if (onRedemptionComplete) onRedemptionComplete(data);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Invalid or expired voucher code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl p-6 bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white shadow-md">
          <ScanLine className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-serif text-base font-bold text-on-surface">Floor Voucher Redemption Desk</h3>
          <p className="text-xs text-on-surface-variant font-mono">Verify and honor patron reward privileges instantly</p>
        </div>
      </div>

      <form onSubmit={handleRedeem} className="flex gap-2.5">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ENTER CODE (e.g. UM-RW-XXXXXX)"
          className="flex-1 px-4 py-3 rounded-xl bg-[#fdfaf6] border border-[#e0c8b0] text-on-surface font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-white text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Redeem Now</span>
            </>
          )}
        </button>
      </form>

      {lastRedeemed && (
        <div className="mt-4 p-4 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-on-surface">Successfully Redeemed: </span>
            <span className="text-secondary font-mono">{lastRedeemed.code}</span>
            {lastRedeemed.reward?.title && (
              <span className="text-on-surface-variant block mt-0.5">
                Privilege: {lastRedeemed.reward.title}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
