export default function AdminMetricCard({ title, value, icon: Icon, change, trend, subtitle, color = 'primary' }) {
  const colorStyles = {
    primary: 'bg-primary-container/20 border-primary/40 text-primary shadow-[0_0_12px_rgba(222,107,144,0.25)]',
    secondary: 'bg-secondary/20 border-secondary/40 text-secondary shadow-[0_0_12px_rgba(228,193,148,0.25)]',
    green: 'bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.25)]',
    amber: 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.25)]',
  };

  return (
    <div className="glass-panel-elevated rounded-[24px] p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 text-on-surface relative overflow-hidden group">
      <div className="relative z-10">
        <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-on-surface-variant font-semibold block mb-1">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            {value}
          </span>
          {change && (
            <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-400' : 'text-primary'}`}>
              {change}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-on-surface-variant/70 mt-1 font-mono">{subtitle}</p>
        )}
      </div>

      {Icon && (
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 ${
            colorStyles[color] || colorStyles.primary
          }`}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      )}
    </div>
  );
}
