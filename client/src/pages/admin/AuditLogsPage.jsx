import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { ScrollText, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLogs(); }, [pagination.page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs({ page: pagination.page, limit: 20 });
      setLogs(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) { toast.error('Failed to load audit logs'); }
    finally { setLoading(false); }
  };

  const actionColor = (action) => {
    if (action.includes('APPROVED') || action.includes('CREATED') || action.includes('LOGIN')) return 'text-success';
    if (action.includes('REJECTED') || action.includes('EXPIRED')) return 'text-error';
    if (action.includes('UPDATED') || action.includes('REDEEMED')) return 'text-info';
    return 'text-deep-brown/60';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="font-serif text-2xl text-deep-brown">Audit Logs</h1>

      <div className="bg-white rounded-xl shadow-royal overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-warm-beige bg-cream">
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Action</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Actor</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden md:table-cell">Role</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60 hidden lg:table-cell">Details</th>
              <th className="text-left px-4 py-3 font-medium text-deep-brown/60">Time</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-deep-brown/30">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-deep-brown/30">No audit logs</td></tr>
              ) : logs.map((log) => (
                <tr key={log._id} className="border-b border-warm-beige/50 hover:bg-cream/50">
                  <td className={`px-4 py-3 font-medium ${actionColor(log.action)}`}>{log.action}</td>
                  <td className="px-4 py-3">{log.actorId?.name || 'System'}</td>
                  <td className="px-4 py-3 text-deep-brown/40 hidden md:table-cell">{log.actorRole || '—'}</td>
                  <td className="px-4 py-3 text-deep-brown/40 text-xs hidden lg:table-cell max-w-xs truncate">
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
                  </td>
                  <td className="px-4 py-3 text-deep-brown/40 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-warm-beige">
            <span className="text-xs text-deep-brown/40">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
            <div className="flex gap-2">
              <button onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page <= 1} className="p-1.5 rounded-lg border border-warm-beige hover:bg-cream disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))} disabled={pagination.page >= pagination.totalPages} className="p-1.5 rounded-lg border border-warm-beige hover:bg-cream disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
