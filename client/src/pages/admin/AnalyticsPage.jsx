import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { BarChart3 } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-deep-brown">Analytics</h1>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="px-3 py-1.5 border border-warm-beige rounded-lg text-sm">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 skeleton rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-royal">
            <h3 className="font-serif text-lg text-deep-brown mb-4">Guest Registrations</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.guestGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#D4847A" fill="#D4847A" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-royal">
            <h3 className="font-serif text-lg text-deep-brown mb-4">Stamps Approved</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.stampsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#C5A572" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-royal">
            <h3 className="font-serif text-lg text-deep-brown mb-4">Reward Redemptions</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.redemptionsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#4CAF50" strokeWidth={2} dot={{ fill: '#4CAF50' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
