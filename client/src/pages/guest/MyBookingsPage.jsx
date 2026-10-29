import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CalendarDays, Clock, Users, Armchair, CheckCircle2, XCircle, Hourglass, Utensils, Plus, RefreshCw, MessageSquare,
} from 'lucide-react';
import { bookingApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useRealtimeRefresh } from '../../context/NotificationContext';

const STATUS_STYLE = {
  PENDING: { icon: Hourglass, cls: 'bg-amber-50 text-amber-800 border-amber-300' },
  CONFIRMED: { icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  CANCELLED: { icon: XCircle, cls: 'bg-red-50 text-red-700 border-red-200' },
  COMPLETED: { icon: Utensils, cls: 'bg-slate-50 text-slate-700 border-slate-300' },
};

const BOOKING_EVENTS = ['BOOKING_PENDING', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_COMPLETED'];

export default function MyBookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await bookingApi.getMyBookings();
      setBookings(res.data?.data?.bookings || []);
    } catch {
      if (!silent) toast.error(t('bookings.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  // Staff confirmations show up instantly
  useRealtimeRefresh(BOOKING_EVENTS, () => load({ silent: true }));

  const handleCancel = async (booking) => {
    if (!window.confirm(t('bookings.cancelConfirm'))) return;
    try {
      setCancellingId(booking._id);
      await bookingApi.cancelMyBooking(booking._id);
      toast.success(t('bookings.cancelled'));
      load({ silent: true });
    } catch (err) {
      toast.error(err.response?.data?.error?.message || t('bookings.cancelError'));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6 text-on-surface">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-outline-variant/20">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">{t('bookings.title')}</h1>
          <p className="text-xs text-on-surface-variant mt-1">{t('bookings.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary cursor-pointer"
            title={t('common.refresh')}
            aria-label={t('common.refresh')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase tracking-wider no-underline shadow-sm hover:brightness-110"
          >
            <Plus className="w-4 h-4" />
            {t('bookings.new')}
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => <div key={i} className="h-28 rounded-2xl bg-surface-container/60" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white border border-[#e0c8b0] text-center space-y-3">
          <CalendarDays className="w-10 h-10 text-primary mx-auto" />
          <p className="font-serif text-lg font-bold">{t('bookings.emptyTitle')}</p>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">{t('bookings.emptyDesc')}</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase tracking-wider no-underline"
          >
            <Plus className="w-4 h-4" />
            {t('bookings.new')}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => {
            const style = STATUS_STYLE[b.status] || STATUS_STYLE.PENDING;
            const StatusIcon = style.icon;
            const canCancel = b.status === 'PENDING' || b.status === 'CONFIRMED';
            return (
              <li key={b._id} className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e0c8b0] shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 min-w-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${style.cls}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {t(`bookings.status.${b.status}`)}
                    </span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-on-surface">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-secondary" />{b.date}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-secondary" />{b.time}</span>
                      <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-secondary" />{b.guests}</span>
                      <span className="inline-flex items-center gap-1.5"><Armchair className="w-4 h-4 text-secondary" />{b.seating}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{t(`bookings.hint.${b.status}`)}</p>
                    {b.staffNote && (
                      <p className="text-xs text-on-surface bg-primary/5 border border-primary/15 rounded-lg px-3 py-2 inline-flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span><strong>{t('bookings.staffNote')}:</strong> {b.staffNote}</span>
                      </p>
                    )}
                  </div>
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancel(b)}
                      disabled={cancellingId === b._id}
                      className="self-start px-3.5 py-2 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {cancellingId === b._id ? '…' : t('bookings.cancel')}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
