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
    { label: 'Total Guests', value: stats.totalGuests, icon: Users, color: 'bg-primary-container/20 text-primary border border-primary/30' },
    { label: 'Total Visits', value: stats.totalVisits, icon: Stamp, color: 'bg-secondary-container/20 text-secondary border border-secondary/30' },
    { label: 'Pending Stamps', value: stats.pendingStamps, icon: Stamp, color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
    { label: 'Rewards Unlocked', value: stats.totalRewardsUnlocked, icon: Gift, color: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
    { label: 'Rewards Redeemed', value: stats.totalRewardsRedeemed, icon: ShoppingBag, color: 'bg-green-500/20 text-green-300 border border-green-500/30' },
    { label: 'Review Clicks', value: stats.totalReviewClicks, icon: Star, color: 'bg-primary-container/20 text-primary border border-primary/30' },
    { label: 'Active Cards', value: stats.activeCards, icon: CreditCard, color: 'bg-secondary-container/20 text-secondary border border-secondary/30' },
    { label: 'Completed Cards', value: stats.completedCards, icon: TrendingUp, color: 'bg-green-500/20 text-green-300 border border-green-500/30' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="h-24 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />)}
        </div>
        <div className="h-64 rounded-3xl bg-surface-container/60 border border-outline-variant/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-on-surface font-bold">Imperial Intelligence Dashboard</h1>
        <p className="text-xs text-on-surface-variant mt-1">Real-time metrics, patron loyalty cadence, and transaction ledger</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, color }) => (
          <AdminMetricCard
            key={label}
            title={label}
            value={value || 0}
            icon={icon}
            color={color.includes('secondary') ? 'secondary' : color.includes('green') ? 'green' : color.includes('amber') ? 'amber' : 'primary'}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Growth */}
        <div className="bg-surface-container/85 rounded-3xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
          <h3 className="font-serif text-base text-on-surface mb-4 flex items-center gap-2 font-bold">
            <BarChart3 className="w-4 h-4 text-primary" /> Patron Growth (30 days)
          </h3>
          <div className="h-52">
            {analytics?.guestGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.guestGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#ffb1c6' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#ffb1c6' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e0f11', borderColor: 'rgba(255,177,198,0.3)', borderRadius: '12px', color: '#ffb1c6' }}
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
        <div className="bg-surface-container/85 rounded-3xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
          <h3 className="font-serif text-base text-on-surface mb-4 flex items-center gap-2 font-bold">
            <TrendingUp className="w-4 h-4 text-secondary" /> Stamps Endorsed Over Time
          </h3>
          <div className="h-52">
            {analytics?.stampsOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.stampsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#e4c194' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#e4c194' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e0f11', borderColor: 'rgba(228,193,148,0.3)', borderRadius: '12px', color: '#e4c194' }}
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
      <div className="bg-surface-container/85 rounded-3xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg">
        <h3 className="font-serif text-base text-on-surface mb-4 font-bold">Recent Court Activity</h3>
        <div className="space-y-2.5 max-h-80 overflow-y-auto">
          {activity.length > 0 ? activity.map((log) => (
            <div key={log._id} className="flex items-center justify-between py-2.5 px-4 bg-surface-container-high/60 border border-outline-variant/20 rounded-xl text-xs">
              <div>
                <span className="font-semibold text-primary">{log.action}</span>
                <span className="text-on-surface-variant/70 ml-2">by {log.actorId?.name || 'Concierge'}</span>
              </div>
              <span className="text-[11px] text-on-surface-variant/50 font-mono">{new Date(log.createdAt).toLocaleString('en-IN')}</span>
            </div>
          )) : (
            <p className="text-xs text-on-surface-variant/50 text-center py-4">No recent activity logged</p>
          )}
        </div>
      </div>
    </div>
  );
}
