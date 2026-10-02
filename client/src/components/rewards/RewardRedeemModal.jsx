import { X, Gift, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RewardRedeemModal({ isOpen, onClose, onConfirm, reward, loading = false }) {
  if (!isOpen || !reward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-secondary/40 shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">Claim Royal Privilege</h3>
              <p className="text-xs text-on-surface-variant font-mono">Maharaja Loyalty Program</p>
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

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center">
            <h4 className="font-serif text-lg font-bold text-on-surface mb-1">
              {reward.title}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {reward.description || 'Valid for dine-in dining privileges at Urban Maharaja.'}
            </p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-xs font-mono font-bold">
              Requires {reward.requiredStamps} Approved Seals
            </div>
          </div>

          <p className="text-xs text-on-surface-variant/80 text-center">
            Once claimed, an official royal voucher passcode will be generated for your table concierge to honor upon your visit.
          </p>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(reward._id)}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-secondary to-[#c29b38] text-white text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Voucher</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
