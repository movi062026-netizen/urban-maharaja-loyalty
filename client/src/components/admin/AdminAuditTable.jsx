import { formatDateTime } from '../../utils';
import { ShieldCheck, AlertCircle, Info, Lock } from 'lucide-react';

export default function AdminAuditTable({ logs = [], loading = false }) {
  const getActionColor = (action = '') => {
    if (action.includes('CREATE') || action.includes('GRANT') || action.includes('APPROVE')) {
      return 'text-secondary bg-secondary/15 border-secondary/30';
    }
    if (action.includes('DELETE') || action.includes('REVOKE') || action.includes('REJECT')) {
      return 'text-error bg-error/15 border-error/30';
    }
    return 'text-primary bg-primary-container/20 border-primary/30';
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-on-surface-variant text-xs">
        <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block mb-2" />
        <p>Loading security audit ledger...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant text-xs bg-surface-container/40 rounded-2xl border border-outline-variant/30">
        <ShieldCheck className="w-8 h-8 text-secondary mx-auto mb-2" />
        <p>No audit events recorded for this timeframe</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-outline-variant/30 text-[10px] uppercase font-mono tracking-wider text-outline">
            <th className="py-3 px-4">Timestamp</th>
            <th className="py-3 px-4">Actor</th>
            <th className="py-3 px-4">Action</th>
            <th className="py-3 px-4">Target Entity</th>
            <th className="py-3 px-4">IP Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/15 font-mono">
          {logs.map((log) => (
            <tr key={log._id || log.id} className="hover:bg-surface-container-high/40 transition-colors">
              <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">
                {formatDateTime(log.createdAt)}
              </td>
              <td className="py-3 px-4 text-on-surface font-semibold whitespace-nowrap">
                {log.performedBy?.name || log.actorName || 'System'}
                <span className="text-[10px] text-on-surface-variant block font-normal">
                  {log.performedBy?.role || log.actorRole}
                </span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider font-bold ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
              </td>
              <td className="py-3 px-4 text-on-surface whitespace-nowrap">
                {log.entityType || 'Resource'}
                {log.entityId && (
                  <span className="text-[10px] text-outline block">
                    ID: {String(log.entityId).slice(-6)}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-outline whitespace-nowrap">
                {log.ipAddress || '127.0.0.1'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
