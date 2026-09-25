export default function AdminMetricCard({ title, value, icon: Icon, change, trend, subtitle, color = 'primary' }) {
  const colorStyles = {
    primary: 'bg-primary-container/20 border-primary/30 text-primary',
    secondary: 'bg-secondary/20 border-secondary/30 text-secondary',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
  };

  return (
    <div className="bg-surface-container/85 rounded-2xl p-5 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex items-center justify-between transition-all hover:scale-[1.01]">
      <div>
        <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            {value}
          </span>
          {change && (
            <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-400' : 'text-primary'}`}>
              {change}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-on-surface-variant/70 mt-1">{subtitle}</p>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${colorStyles[color] || colorStyles.primary}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
