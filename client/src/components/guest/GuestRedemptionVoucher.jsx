import { useState } from 'react';
import { Gift, Copy, Check, QrCode, Clock, Award, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { copyToClipboard, formatDate } from '../../utils';
import { REWARDS_TERMS_AND_CONDITIONS } from '../../constants';
import toast from 'react-hot-toast';

const rewardIcons = {
  COMPLIMENTARY_ITEM: Gift,
  DISCOUNT: Award,
};

export default function GuestRedemptionVoucher({ redemption }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const isAvailable = redemption.status === 'AVAILABLE';
  const isRedeemed = redemption.status === 'REDEEMED';
  const rewardType = redemption.reward?.rewardType || 'COMPLIMENTARY_ITEM';
  const Icon = rewardIcons[rewardType] || Gift;

  // Guaranteed readable voucher code: use redemption.code, or fallback to UM-RW + last 6 chars of ID
  const voucherCode =
    redemption.code ||
    (redemption._id ? `UM-RW-${String(redemption._id).slice(-6).toUpperCase()}` : 'UM-RW-PALACE');

  const handleCopy = async () => {
    if (!voucherCode) return;
    const ok = await copyToClipboard(voucherCode);
    if (ok) {
      setCopied(true);
      toast.success(`Passcode ${voucherCode} copied!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-[24px] relative overflow-hidden transition-all duration-300 group ${
        isAvailable
          ? 'bg-white border-2 border-[#e4d3c2] shadow-[0_14px_40px_-10px_rgba(46,26,16,0.1)] hover:shadow-[0_20px_48px_-10px_rgba(155,40,78,0.18)] hover:border-primary/40 hover:-translate-y-1'
          : 'bg-[#faf6f1] border border-[#d8c7b6] shadow-xs'
      }`}
    >
      {/* Top Royal Accent Line */}
      <div
        className="h-1.5 w-full"
        style={{
          background: isAvailable
            ? 'linear-gradient(90deg, #ba3461 0%, #e882a3 35%, #cca056 70%, #ba3461 100%)'
            : '#8c7664',
        }}
      />

      <div className="relative z-10 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                isAvailable
                  ? 'bg-gradient-to-br from-primary-container to-secondary text-white border border-white/40 shadow-[0_8px_20px_-4px_rgba(155,40,78,0.35)]'
                  : 'bg-primary/10 text-primary border border-primary/25'
              }`}
            >
              <Icon className={`w-6 h-6 ${isAvailable ? 'text-white' : 'text-primary'}`} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#744d1c] block font-sans">
                Dining Certificate
              </span>
              <h4 className="font-serif text-base sm:text-lg font-black text-on-surface leading-tight">
                {redemption.reward?.title || 'Royal Privilege'}
              </h4>
              {redemption.reward?.description && (
                <p className="text-xs text-[#3b241a] font-medium mt-1 leading-snug">
                  {redemption.reward.description}
                </p>
              )}
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider px-3 py-1 rounded-full font-black border shrink-0 ${
              isAvailable
                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                : isRedeemed
                ? 'bg-stone-200 text-stone-900 border-stone-400'
                : 'bg-stone-100 text-stone-800 border-stone-300'
            }`}
          >
            {isAvailable && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
            {isAvailable ? 'Ready to Redeem' : redemption.status}
          </span>
        </div>

        {/* Voucher Code Box */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#e0c8b0] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#483328] block font-mono font-black mb-1">
              Passcode for Concierge
            </span>
            <span className="font-mono text-lg sm:text-xl font-black text-primary tracking-[0.18em]">
              {voucherCode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAvailable && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-primary-container/10 text-on-surface hover:text-primary transition-all cursor-pointer border border-[#e4d3c2] hover:border-primary/40 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  title="Copy code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-primary" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className="p-2 rounded-xl bg-white hover:bg-primary-container/10 text-primary transition-all cursor-pointer border border-[#e4d3c2] hover:border-primary/40 shadow-xs"
                  title="Toggle QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* QR Code Presentation */}
        {showQr && isAvailable && (
          <div className="mt-4 p-5 rounded-2xl bg-white text-center border-2 border-primary/20 shadow-md animate-fadeIn">
            <div className="p-2 inline-block bg-white rounded-xl border border-stone-200 shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(voucherCode)}`}
                alt="QR Code"
                className="w-36 h-36 rounded-lg"
              />
            </div>
            <p className="text-[11px] text-on-surface font-semibold mt-2.5">
              Present this QR to your concierge or floor captain
            </p>
            <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">
              Valid for table dining bill credit
            </p>
          </div>
        )}

        {/* Visually secondary Terms toggle */}
        <div className="pt-2.5 mt-2.5 border-t border-[#e0c8b0]">
          <button
            type="button"
            onClick={() => setShowTerms(!showTerms)}
            className="w-full flex items-center justify-between text-[11px] text-[#483328] hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#744d1c]" />
              <span className="text-[#3b241a] group-hover:text-primary">Voucher Terms &amp; Conditions</span>
            </span>
            {showTerms ? <ChevronUp className="w-4 h-4 text-[#483328]" /> : <ChevronDown className="w-4 h-4 text-[#483328]" />}
          </button>
          {showTerms && (
            <ul className="mt-2.5 space-y-1.5 text-[11px] text-[#3b241a] pl-4 list-disc leading-relaxed font-sans">
              {REWARDS_TERMS_AND_CONDITIONS.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer dates */}
        <div className="flex items-center justify-between text-xs text-[#483328] font-semibold pt-3 border-t border-[#e0c8b0] font-mono">
          <span>Issued: {formatDate(redemption.createdAt)}</span>
          {redemption.expiresAt && (
            <span className={`flex items-center gap-1 ${isAvailable ? 'text-primary font-bold' : 'text-[#483328]'}`}>
              <Clock className="w-3.5 h-3.5 text-secondary" /> Exp: {formatDate(redemption.expiresAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
