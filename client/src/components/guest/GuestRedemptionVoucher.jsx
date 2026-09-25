import { useState } from 'react';
import { Gift, Copy, Check, QrCode, Clock } from 'lucide-react';
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
    <div className={`rounded-2xl p-5 border transition-all ${
      isAvailable
        ? 'bg-gradient-to-br from-surface-container-high/90 to-surface-container/90 border-secondary/40 shadow-lg'
        : 'bg-surface-container-low/60 border-outline-variant/20 opacity-75'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isAvailable ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-surface-container text-outline'
          }`}>
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-on-surface">
              {redemption.reward?.title || 'Royal Privilege Voucher'}
            </h4>
            <span className={`inline-block text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full mt-1 ${
              isAvailable
                ? 'bg-secondary/20 text-secondary border border-secondary/30'
                : 'bg-surface-container text-outline'
            }`}>
              {redemption.status}
            </span>
          </div>
        </div>

        {isAvailable && (
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-highest text-primary border border-outline-variant/30 transition-colors"
            title="Show QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Voucher Code Box */}
      <div className="my-3.5 p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-outline block">Voucher Passcode</span>
          <span className="font-mono text-sm font-bold text-on-surface tracking-widest">
            {redemption.code}
          </span>
        </div>
        {isAvailable && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-surface-container text-secondary transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      {showQr && isAvailable && (
        <div className="my-3 p-4 rounded-xl bg-surface-container-lowest text-center border border-outline-variant/30 animate-fadeIn">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(redemption.code)}`}
            alt="Redemption QR"
            className="mx-auto rounded-lg shadow-md mb-2 border border-outline-variant/40"
          />
          <p className="text-[11px] text-on-surface-variant font-mono">Present to floor staff for scanning</p>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-on-surface-variant/70 pt-2 border-t border-outline-variant/20">
        <span>Issued: {formatDate(redemption.createdAt)}</span>
        {redemption.expiresAt && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Expires: {formatDate(redemption.expiresAt)}
          </span>
        )}
      </div>
    </div>
  );
}
