import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '../../services/api';
import { ScrollText, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
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

  const actionBadge = (action) => {
    if (action.includes('APPROVED') || action.includes('CREATED') || action.includes('LOGIN')) {
      return 'text-green-600 bg-green-500/10 border-green-500/20';
    }
    if (action.includes('REJECTED') || action.includes('EXPIRED') || action.includes('DEACTIVATED')) {
      return 'text-red-600 bg-red-500/10 border-red-500/20';
    }
    return 'text-primary bg-primary/10 border-primary/20';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6 animate-fadeIn text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Security &amp; Audit Trail</h1>
        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
          Immutable event ledger tracking staff credentials, seal grants, and administrative operations
        </p>
      </div>

      <div className="glass-panel-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-xs uppercase tracking-wider text-secondary">
                <th className="text-left px-5 py-3.5 font-semibold">Security Action</th>
                <th className="text-left px-5 py-3.5 font-semibold">Operator</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Role</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden lg:table-cell">Context Data</th>
                <th className="text-left px-5 py-3.5 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading security ledger...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant">
                    No audit records logged.
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log._id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${actionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-on-surface">{log.actorId?.name || 'System Auto'}</td>
                  <td className="px-5 py-4 text-secondary text-xs font-mono hidden md:table-cell">{log.actorRole || '—'}</td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs font-mono hidden lg:table-cell max-w-xs truncate">
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-outline-variant/30 bg-surface-container-lowest/40">
            <span className="text-xs text-on-surface-variant">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
