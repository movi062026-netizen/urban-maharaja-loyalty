import { Clock, CheckCircle } from 'lucide-react';

export default function StaffLiveQueue({ pendingRequests = [], onApprove }) {
  if (!pendingRequests || pendingRequests.length === 0) return null;

  return (
    <div className="glass-panel-elevated p-4 sm:p-5" style={{ borderColor: 'rgba(251,191,36,0.25)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" aria-hidden="true" />
          <h2 className="font-serif text-sm sm:text-base font-bold text-amber-200">
            Awaiting Floor Seal Verification ({pendingRequests.length})
          </h2>
        </div>
        <span className="text-[9px] sm:text-[11px] text-amber-300/80 font-mono uppercase tracking-wider font-semibold">
          Live Patron Dining Requests
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {pendingRequests.map((p) => {
          const guestName = p.guestId?.name || (p.guestId?.email ? p.guestId.email.split('@')[0] : 'Noble Patron');
          const guestContact = p.guestId?.email || p.guestId?.phone || 'Guest';

          return (
            <div
              key={p._id}
              className="p-3 sm:p-3.5 rounded-xl glass-surface border border-outline-variant/30 flex items-center justify-between gap-2 sm:gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-semibold text-on-surface text-[10px] sm:text-xs truncate">
                  {guestName}
                </p>
                <p className="text-[9px] sm:text-[11px] text-on-surface-variant font-mono truncate">
                  {guestContact}
                </p>
                <span className="text-[9px] sm:text-[10px] text-amber-300 font-mono flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5 shrink-0" />
                  <span>Just now</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => onApprove && onApprove(p._id)}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30 text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 shadow-sm"
                aria-label={`Approve stamp for ${guestName}`}
              >
                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Approve</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
