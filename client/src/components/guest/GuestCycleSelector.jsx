import { ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export default function GuestCycleSelector({ allCards = [], activeCardId, onSelectCycle }) {
  if (!allCards || allCards.length <= 1) return null;

  return (
    <div className="glass-panel-elevated p-5 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif font-bold text-on-surface text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Your Maharaja Card Cycles</span>
        </h3>
        <span className="text-[10px] text-secondary font-mono uppercase tracking-wider font-semibold">
          Lifetime Progression
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {allCards.map((c) => {
          const isActive = c._id === activeCardId || c.status === 'ACTIVE';
          return (
            <button
              key={c._id}
              type="button"
              onClick={() => onSelectCycle && onSelectCycle(c)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-container/20 border-primary/50 text-on-surface shadow-[0_0_12px_rgba(222,107,144,0.25)]'
                  : 'bg-surface-container-high/60 border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs">Cycle #{c.cycleNumber}</span>
                {c.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
              <p className="text-[11px] font-mono font-medium">
                {c.currentStamps}/{c.targetStamps} Seals
              </p>
              <span className={`text-[9px] font-bold uppercase tracking-wider block mt-1 ${
                c.status === 'COMPLETED' ? 'text-green-300' : 'text-primary'
              }`}>
                {c.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
