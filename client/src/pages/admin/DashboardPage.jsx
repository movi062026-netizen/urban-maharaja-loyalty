import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Users, Stamp, Gift, ShoppingBag, Star, CreditCard, BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
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
    { label: 'Total Guests', value: stats.totalGuests, icon: Users, color: 'bg-royal-rose/10 text-royal-rose' },
    { label: 'Total Visits', value: stats.totalVisits, icon: Stamp, color: 'bg-royal-gold/10 text-royal-gold' },
    { label: 'Pending Stamps', value: stats.pendingStamps, icon: Stamp, color: 'bg-warning/10 text-warning' },
    { label: 'Rewards Unlocked', value: stats.totalRewardsUnlocked, icon: Gift, color: 'bg-info/10 text-info' },
    { label: 'Rewards Redeemed', value: stats.totalRewardsRedeemed, icon: ShoppingBag, color: 'bg-success/10 text-success' },
    { label: 'Review Clicks', value: stats.totalReviewClicks, icon: Star, color: 'bg-royal-rose/10 text-royal-rose' },
    { label: 'Active Cards', value: stats.activeCards, icon: CreditCard, color: 'bg-royal-gold/10 text-royal-gold' },
    { label: 'Completed Cards', value: stats.completedCards, icon: TrendingUp, color: 'bg-success/10 text-success' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
        </div>
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="font-serif text-2xl text-deep-brown">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-royal hover:shadow-royal-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-deep-brown">{value || 0}</p>
            <p className="text-xs text-deep-brown/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Growth */}
        <div className="bg-white rounded-xl p-5 shadow-royal">
          <h3 className="font-serif text-lg text-deep-brown mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-royal-rose" /> Guest Growth (30 days)
          </h3>
          <div className="h-52">
            {analytics?.guestGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.guestGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D4847A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-deep-brown/30">No data yet</div>
            )}
          </div>
        </div>

        {/* Stamps Over Time */}
        <div className="bg-white rounded-xl p-5 shadow-royal">
          <h3 className="font-serif text-lg text-deep-brown mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-royal-gold" /> Stamps Over Time
          </h3>
          <div className="h-52">
            {analytics?.stampsOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.stampsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#C5A572" strokeWidth={2} dot={{ fill: '#C5A572' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-deep-brown/30">No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-royal">
        <h3 className="font-serif text-lg text-deep-brown mb-4">Recent Activity</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {activity.length > 0 ? activity.map((log) => (
            <div key={log._id} className="flex items-center justify-between py-2 px-3 bg-cream rounded-lg text-sm">
              <div>
                <span className="font-medium text-deep-brown">{log.action}</span>
                <span className="text-deep-brown/40 ml-2">by {log.actorId?.name || 'System'}</span>
              </div>
              <span className="text-xs text-deep-brown/30">{new Date(log.createdAt).toLocaleString('en-IN')}</span>
            </div>
          )) : (
            <p className="text-sm text-deep-brown/30 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
