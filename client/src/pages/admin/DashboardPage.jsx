import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Users, Stamp, Gift, ShoppingBag, Star, CreditCard, BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import AdminMetricCard from '../../components/admin/AdminMetricCard';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, analyticsRes, activityRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAnalytics(30),
        adminApi.getRecentActivity(),
      ]);
      setStats(statsRes.data.data);
      setAnalytics(analyticsRes.data.data);
      setActivity(activityRes.data.data.activity || []);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Total Guests', value: stats.totalGuests, icon: Users, color: 'primary' },
    { label: 'Total Visits', value: stats.totalVisits, icon: Stamp, color: 'secondary' },
    { label: 'Pending Stamps', value: stats.pendingStamps, icon: Stamp, color: 'amber' },
    { label: 'Rewards Unlocked', value: stats.totalRewardsUnlocked, icon: Gift, color: 'primary' },
    { label: 'Rewards Redeemed', value: stats.totalRewardsRedeemed, icon: ShoppingBag, color: 'green' },
    { label: 'Review Clicks', value: stats.totalReviewClicks, icon: Star, color: 'primary' },
    { label: 'Active Cards', value: stats.activeCards, icon: CreditCard, color: 'secondary' },
    { label: 'Completed Cards', value: stats.completedCards, icon: TrendingUp, color: 'green' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="stats-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="h-24 sm:h-28 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />)}
        </div>
        <div className="h-48 sm:h-64 rounded-3xl bg-surface-container/60 border border-outline-variant/30" />
      </div>
    );
  }

  return (
    <section className="space-y-5 sm:space-y-6 text-on-surface" aria-label="Admin Dashboard">
      <header>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold">Imperial Intelligence Dashboard</h1>
        <p className="text-[10px] sm:text-xs text-on-surface-variant mt-1">Real-time metrics, patron loyalty cadence, and transaction ledger</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid stagger-children">
        {statCards.map(({ label, value, icon, color }) => (
          <AdminMetricCard
            key={label}
            title={label}
            value={value || 0}
            icon={icon}
            color={color}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Guest Growth */}
        <div className="glass-panel-elevated p-4 sm:p-6">
          <h3 className="font-serif text-sm sm:text-base text-on-surface mb-3 sm:mb-4 flex items-center gap-2 font-bold">
            <BarChart3 className="w-4 h-4 text-primary" /> Patron Growth (30 days)
          </h3>
          <div className="h-40 sm:h-52">
            {analytics?.guestGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.guestGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#ffb1c6' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#ffb1c6' }} width={30} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e0f11', borderColor: 'rgba(255,177,198,0.3)', borderRadius: '12px', color: '#ffb1c6', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#de6b90" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-on-surface-variant/50">No growth data in window</div>
            )}
          </div>
        </div>

        {/* Stamps Over Time */}
        <div className="glass-panel-elevated p-4 sm:p-6">
          <h3 className="font-serif text-sm sm:text-base text-on-surface mb-3 sm:mb-4 flex items-center gap-2 font-bold">
            <TrendingUp className="w-4 h-4 text-secondary" /> Stamps Endorsed Over Time
          </h3>
          <div className="h-40 sm:h-52">
            {analytics?.stampsOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.stampsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#e4c194' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#e4c194' }} width={30} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e0f11', borderColor: 'rgba(228,193,148,0.3)', borderRadius: '12px', color: '#e4c194', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#e4c194" strokeWidth={2.5} dot={{ fill: '#e4c194', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-on-surface-variant/50">No stamps recorded in window</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel-elevated p-4 sm:p-6">
        <h3 className="font-serif text-sm sm:text-base text-on-surface mb-3 sm:mb-4 font-bold">Recent Court Activity</h3>
        <div className="space-y-2 sm:space-y-2.5 max-h-64 sm:max-h-80 overflow-y-auto">
          {activity.length > 0 ? activity.map((log) => (
            <div key={log._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-2.5 px-3 sm:px-4 glass-table-row rounded-xl text-[10px] sm:text-xs gap-1">
              <div className="min-w-0">
                <span className="font-semibold text-primary">{log.action}</span>
                <span className="text-on-surface-variant/70 ml-2">by {log.actorId?.name || 'Concierge'}</span>
              </div>
              <span className="text-[9px] sm:text-[11px] text-on-surface-variant/50 font-mono shrink-0">{new Date(log.createdAt).toLocaleString('en-IN')}</span>
            </div>
          )) : (
            <p className="text-xs text-on-surface-variant/50 text-center py-4">No recent activity logged</p>
          )}
        </div>
      </div>
    </section>
  );
}
