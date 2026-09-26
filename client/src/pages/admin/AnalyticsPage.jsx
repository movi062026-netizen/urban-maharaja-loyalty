import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { BarChart3, TrendingUp, Users, Stamp, Gift } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnalytics(); }, [days]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAnalytics(days);
      setAnalytics(res.data.data);
    } catch (err) { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  const chartTheme = {
    grid: '#3a2024',
    tick: '#e6bdc5',
    tooltipBg: '#210e11',
    tooltipBorder: '#de6b90',
  };

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-on-surface font-bold">Palace Analytics &amp; Intelligence</h1>
          <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
            Deep dive into patron growth, seal issuance velocity, and reward redemption trends
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-xs text-on-surface font-semibold focus:outline-none focus:border-primary"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Guest Registrations */}
          <div className="glass-panel-elevated p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg text-on-surface font-bold">Noble Patron Inductions</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.guestGrowth || []}>
                  <defs>
                    <linearGradient id="patronGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#de6b90" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#de6b90" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="date" tick={{ fill: chartTheme.tick, fontSize: 11 }} />
                  <YAxis tick={{ fill: chartTheme.tick, fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="count" stroke="#de6b90" strokeWidth={2.5} fill="url(#patronGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stamps Approved */}
          <div className="glass-panel-elevated p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Stamp className="w-5 h-5 text-secondary" />
              <h3 className="font-serif text-lg text-on-surface font-bold">Royal Seals Granted</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.stampsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="date" tick={{ fill: chartTheme.tick, fontSize: 11 }} />
                  <YAxis tick={{ fill: chartTheme.tick, fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: '#e4c194', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#e4c194" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reward Redemptions */}
          <div className="glass-panel-elevated p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-green-400" />
              <h3 className="font-serif text-lg text-on-surface font-bold">Completed Voucher Redemptions</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.redemptionsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="date" tick={{ fill: chartTheme.tick, fontSize: 11 }} />
                  <YAxis tick={{ fill: chartTheme.tick, fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: '#4ade80', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={3} dot={{ fill: '#4ade80', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
