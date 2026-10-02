import { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, Eye, X, FileText, Image as ImageIcon } from 'lucide-react';

export default function StaffLiveQueue({ pendingRequests = [], onApprove, onReject }) {
  const [selectedBill, setSelectedBill] = useState(null);

  if (!pendingRequests || pendingRequests.length === 0) return null;

  return (
    <>
      <div className="glass-panel-elevated p-4 sm:p-5" style={{ borderColor: 'rgba(251,191,36,0.25)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" aria-hidden="true" />
            <h2 className="font-serif text-sm sm:text-base font-bold text-amber-700">
              Awaiting Floor Seal Verification ({pendingRequests.length})
            </h2>
          </div>
          <span className="text-[9px] sm:text-[11px] text-amber-700/80 font-mono uppercase tracking-wider font-semibold">
            Live Patron Dining Requests (Cloudinary WebP Bills)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pendingRequests.map((p) => {
            const guestName = p.guestId?.name || (p.guestId?.email ? p.guestId.email.split('@')[0] : 'Noble Patron');
            const guestContact = p.guestId?.email || p.guestId?.phone || 'Guest';
            const hasBill = Boolean(p.billUrl);
            const isHighRisk = (p.fraudRiskScore || 0) >= 30 || (p.fraudWarnings && p.fraudWarnings.length > 0);

            return (
              <div
                key={p._id}
                className={`p-3.5 rounded-2xl glass-surface border transition-all flex flex-col justify-between gap-3 ${
                  isHighRisk
                    ? 'border-amber-500/60 bg-amber-500/5 hover:border-amber-400'
                    : 'border-outline-variant/30 hover:border-primary/40'
                }`}
              >
                {/* Header: Guest Info & Bill Thumbnail */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-on-surface text-xs sm:text-sm truncate">
                      {guestName}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-mono truncate">
                      {guestContact}
                    </p>
                    {p.billNumber && (
                      <p className="text-[10px] text-secondary font-mono mt-0.5">
                        Receipt: #{p.billNumber}
                      </p>
                    )}
                    {p.billAmount !== undefined && (
                      <p className="text-[10px] text-on-surface font-semibold font-mono">
                        Amount: ₹{p.billAmount}
                      </p>
                    )}
                  </div>

                  {/* Bill Receipt Thumbnail */}
                  {hasBill ? (
                    <button
                      type="button"
                      onClick={() => setSelectedBill({ url: p.billUrl, guestName, billNumber: p.billNumber, billAmount: p.billAmount })}
                      className="relative group shrink-0 w-14 h-14 rounded-xl border border-primary/40 overflow-hidden bg-surface-container hover:scale-105 transition-all cursor-pointer"
                      title="Inspect Cloudinary WebP Receipt"
                    >
                      <img
                        src={p.billUrl}
                        alt="Bill Receipt"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                    </button>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Anti-Fraud Warning Pill */}
                {isHighRisk && (
                  <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-700 space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Fraud Risk Score: {p.fraudRiskScore || 30}/100</span>
                    </div>
                    {p.fraudWarnings && p.fraudWarnings.map((warn, i) => (
                      <p key={i} className="text-[9px] leading-tight text-amber-700/80">
                        • {warn}
                      </p>
                    ))}
                  </div>
                )}

                {/* Footer Controls: Approve / Reject Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
                  <span className="text-[9px] text-on-surface-variant font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>Pending</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {onReject && (
                      <button
                        type="button"
                        onClick={() => onReject(p._id)}
                        className="px-2.5 py-1 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-100 text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onApprove && onApprove(p._id)}
                      className="px-3 py-1 rounded-lg bg-green-100 text-green-600 hover:bg-green-500/30 border border-green-500/30 text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      aria-label={`Approve stamp for ${guestName}`}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bill Image Inspection Lightbox Modal */}
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
              <span className="font-mono text-[10px]">Format: Cloudinary WebP</span>
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
    </>
  );
}
