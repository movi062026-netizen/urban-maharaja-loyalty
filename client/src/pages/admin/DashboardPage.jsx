import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '../../services/api';
import { Users, Stamp, Gift, ShoppingBag, Star, CreditCard, BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import AdminMetricCard from '../../components/admin/AdminMetricCard';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

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
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-5 sm:space-y-6 text-on-surface"
      aria-label="Admin Dashboard"
    >
      <motion.header variants={itemVariants}>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold">Imperial Intelligence Dashboard</h1>
        <p className="text-[10px] sm:text-xs text-on-surface-variant mt-1">Real-time metrics, patron loyalty cadence, and transaction ledger</p>
      </motion.header>

      {/* Stats Grid */}
      <motion.div className="stats-grid" variants={containerVariants}>
        {statCards.map(({ label, value, icon, color }) => (
          <motion.div key={label} variants={itemVariants}>
            <AdminMetricCard
              title={label}
              value={value || 0}
              icon={icon}
              color={color}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" variants={containerVariants}>
        {/* Guest Growth */}
        <motion.div
          variants={itemVariants}
          className="glass-panel-elevated p-4 sm:p-6 hover:shadow-[0_28px_60px_-15px_rgba(160,58,94,0.12)]"
        >
          <h3 className="font-serif text-sm sm:text-base text-on-surface mb-3 sm:mb-4 flex items-center gap-2 font-bold">
            <BarChart3 className="w-4 h-4 text-primary" /> Patron Growth (30 days)
          </h3>
          <div className="h-40 sm:h-52">
            {analytics?.guestGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.guestGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(46,26,20,0.08)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#a03a5e' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#a03a5e' }} width={30} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f5ebde', borderColor: 'rgba(160,58,94,0.3)', borderRadius: '12px', color: '#a03a5e', fontSize: '11px', boxShadow: '0 8px 24px rgba(46,26,20,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#de6b90" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-on-surface-variant/50">No growth data in window</div>
            )}
          </div>
        </motion.div>

        {/* Stamps Over Time */}
        <motion.div
          variants={itemVariants}
          className="glass-panel-elevated p-4 sm:p-6 hover:shadow-[0_28px_60px_-15px_rgba(228,193,148,0.15)]"
        >
          <h3 className="font-serif text-sm sm:text-base text-on-surface mb-3 sm:mb-4 flex items-center gap-2 font-bold">
            <TrendingUp className="w-4 h-4 text-secondary" /> Stamps Endorsed Over Time
          </h3>
          <div className="h-40 sm:h-52">
            {analytics?.stampsOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.stampsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(46,26,20,0.08)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#7a5c2e' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#7a5c2e' }} width={30} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f5ebde', borderColor: 'rgba(122,92,46,0.3)', borderRadius: '12px', color: '#7a5c2e', fontSize: '11px', boxShadow: '0 8px 24px rgba(46,26,20,0.1)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#a03a5e" strokeWidth={2.5} dot={{ fill: '#a03a5e', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-on-surface-variant/50">No stamps recorded in window</div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="glass-panel-elevated p-4 sm:p-6">
        <h3 className="font-serif text-sm sm:text-base text-on-surface mb-3 sm:mb-4 font-bold">Recent Court Activity</h3>
        <div className="space-y-2 sm:space-y-2.5 max-h-64 sm:max-h-80 overflow-y-auto">
          {activity.length > 0 ? activity.map((log, idx) => (
            <motion.div
              key={log._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-2.5 px-3 sm:px-4 glass-table-row rounded-xl text-[10px] sm:text-xs gap-1"
            >
              <div className="min-w-0">
                <span className="font-semibold text-primary">{log.action}</span>
                <span className="text-on-surface-variant/70 ml-2">by {log.actorId?.name || 'Concierge'}</span>
              </div>
              <span className="text-[9px] sm:text-[11px] text-on-surface-variant/50 font-mono shrink-0">{new Date(log.createdAt).toLocaleString('en-IN')}</span>
            </motion.div>
          )) : (
            <p className="text-xs text-on-surface-variant/50 text-center py-4">No recent activity logged</p>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
