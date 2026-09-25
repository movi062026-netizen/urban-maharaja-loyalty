import { useState } from 'react';
import { Gift, Copy, Check, QrCode, Clock, Sparkles } from 'lucide-react';
import { copyToClipboard, formatDate } from '../../utils';
import toast from 'react-hot-toast';

export default function GuestRedemptionVoucher({ redemption }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const isAvailable = redemption.status === 'AVAILABLE';

  const handleCopy = async () => {
    if (!redemption.code) return;
    const ok = await copyToClipboard(redemption.code);
    if (ok) {
      setCopied(true);
      toast.success('Voucher code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-[24px] p-5.5 transition-all duration-300 relative overflow-hidden text-on-surface ${
        isAvailable
          ? 'glass-panel-elevated hover:border-secondary/50 hover:shadow-[0_16px_36px_-10px_rgba(228,193,148,0.25)]'
          : 'bg-surface-container-lowest/60 border border-white/5 opacity-70'
      }`}
    >
      {/* Subtle ambient light */}
      {isAvailable && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isAvailable
                ? 'bg-gradient-to-br from-secondary/20 to-primary-container/20 border border-secondary/40 text-secondary shadow-[0_0_12px_rgba(228,193,148,0.3)]'
                : 'bg-surface-container text-outline'
            }`}
          >
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-on-surface">
              {redemption.reward?.title || 'Royal Privilege Voucher'}
            </h4>
            <span
              className={`inline-block text-[9px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full mt-1 ${
                isAvailable
                  ? 'bg-secondary/20 text-secondary border border-secondary/30 font-semibold'
                  : 'bg-surface-container text-outline'
              }`}
            >
              {redemption.status}
            </span>
          </div>
        </div>

        {isAvailable && (
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-secondary border border-secondary/30 transition-all cursor-pointer shadow-sm shrink-0"
            title="Show Table QR"
          >
            <QrCode className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Voucher Code Box */}
      <div className="my-3.5 p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest/90 border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-outline block font-mono">
            Voucher Passcode
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-secondary tracking-widest">
            {redemption.code}
          </span>
        </div>
        {isAvailable && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-surface-container text-secondary transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      {showQr && isAvailable && (
        <div className="my-3 p-4 rounded-2xl bg-surface-container-lowest text-center border border-white/10 animate-fadeIn shadow-inner">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
              redemption.code
            )}`}
            alt="Redemption QR"
            className="mx-auto rounded-xl shadow-lg mb-2 border border-secondary/30 p-2 bg-white"
          />
          <p className="text-[11px] text-on-surface-variant font-mono">
            Present to floor concierge for direct table redemption
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-on-surface-variant/70 pt-2.5 border-t border-white/10 font-mono">
        <span>Issued: {formatDate(redemption.createdAt)}</span>
        {redemption.expiresAt && (
          <span className="flex items-center gap-1 text-secondary">
            <Clock className="w-3.5 h-3.5" /> Exp: {formatDate(redemption.expiresAt)}
          </span>
        )}
      </div>
    </div>
  );
}
