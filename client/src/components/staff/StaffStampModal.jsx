import { useState } from 'react';
import { X, Stamp, ShieldCheck } from 'lucide-react';

export default function StaffStampModal({ guest, isOpen, onClose, onConfirm, loading = false }) {
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !guest) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      guestId: guest._id,
      tableNumber,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-secondary/40 shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">Grant Royal Seal</h3>
              <p className="text-xs text-on-surface-variant font-mono">Floor Concierge Authorization</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/30">
            <span className="text-[10px] uppercase font-mono tracking-wider text-secondary block">
              Honored Patron
            </span>
            <div className="font-serif text-base font-bold text-on-surface mt-0.5">
              {guest.name}
            </div>
            <div className="text-xs text-on-surface-variant font-mono mt-0.5">
              {guest.email || guest.phone}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Table / Booth Number (Optional)
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. Table 12 or Royal Booth B"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Service Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Celebrated anniversary dinner"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-secondary to-[#c29b38] text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Seal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
