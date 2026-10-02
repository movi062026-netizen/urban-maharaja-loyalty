export default function AdminMetricCard({ title, value, icon: Icon, change, trend, subtitle, color = 'primary' }) {
  const colorStyles = {
    primary: 'bg-primary-container/25 border-primary/30 text-primary',
    secondary: 'bg-secondary/15 border-secondary/30 text-secondary',
    green: 'bg-emerald-50 border-emerald-500/30 text-emerald-600',
    amber: 'bg-amber-50 border-amber-500/30 text-amber-600',
  };

  const glowStyles = {
    primary: 'shadow-[0_0_18px_rgba(160,58,94,0.12)]',
    secondary: 'shadow-[0_0_18px_rgba(228,193,148,0.15)]',
    green: 'shadow-[0_0_18px_rgba(16,185,129,0.12)]',
    amber: 'shadow-[0_0_18px_rgba(217,119,6,0.12)]',
  };

  return (
    <div className="glass-panel-elevated rounded-[24px] p-5 sm:p-6 flex items-center justify-between transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 text-on-surface relative overflow-hidden group">
      {/* Subtle ambient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-on-surface-variant font-semibold block mb-1">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            {value}
          </span>
          {change && (
            <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-primary'}`}>
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
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
            colorStyles[color] || colorStyles.primary
          } ${glowStyles[color] || glowStyles.primary}`}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      )}
    </div>
  );
}
