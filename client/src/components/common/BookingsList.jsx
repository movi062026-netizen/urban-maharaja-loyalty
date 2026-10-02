import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock, Users, MapPin, Phone, Mail,
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Search,
  UtensilsCrossed, MessageSquare
} from 'lucide-react';
import { bookingApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function BookingsList({ title = 'Table Reservations & Orders', isCompact = false }) {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getBookings({
        status: statusFilter,
        search: search.trim() || undefined,
        limit: isCompact ? 10 : 50,
      });
      setBookings(res.data?.data?.bookings || []);
      if (res.data?.data?.stats) {
        setStats(res.data.data.stats);
      }
    } catch (err) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadBookings();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await bookingApi.updateBookingStatus(id, newStatus);
      toast.success(`Reservation status updated to ${newStatus}!`);
      await loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to update reservation');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-800 text-[11px] font-bold uppercase tracking-wider animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pending Action</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-on-surface">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
              Live Floor Bookings
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#1d0f09]">
            {title}
          </h2>
          <p className="text-xs text-[#2d1a10] mt-0.5">
            Incoming table reservations submitted from the website guest portal
          </p>
        </div>

        {/* Stats Chips & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>{stats.pending} Pending</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>{stats.confirmed} Confirmed</span>
          </div>

          <button
            onClick={loadBookings}
            disabled={loading}
            className="p-2 rounded-xl bg-white hover:bg-[#fdfaf6] border border-[#ede0d2] text-[#1d0f09] hover:text-primary transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#ede0d2] shadow-xs">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-[#483328] hover:text-[#1d0f09] hover:bg-[#fdfaf6]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7e5c46] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patron or phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#ede0d2] text-xs font-medium text-[#1d0f09] placeholder-[#8d715d] focus:outline-none focus:border-primary shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Bookings Cards Grid */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-[#ede0d2]" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-3xl bg-white border-2 border-dashed border-[#ede0d2] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1d0f09]">No reservations found</h3>
          <p className="text-xs text-[#483328] max-w-md mx-auto">
            When guests submit a dining room reservation on the website ("Sovereign Booking"), it appears immediately here for floor staff and management.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 transition-all shadow-xs flex flex-col justify-between ${
                booking.status === 'PENDING'
                  ? 'border-amber-400/80 bg-amber-50/20'
                  : 'border-[#ede0d2] hover:border-primary/40'
              }`}
            >
              {/* Header row */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1d0f09]">
                      {booking.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <a
                        href={`tel:${booking.phone}`}
                        className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline no-underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{booking.phone}</span>
                      </a>
                      {booking.email && (
                        <span className="text-[#5e3810] inline-flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{booking.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                {/* Details badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-[#fdfaf6] border border-[#ede0d2] text-xs font-semibold text-[#1d0f09] mb-3">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{booking.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{booking.time}</span>
                  </div>

                  <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <Users className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{booking.guests}</span>
                  </div>

                  <div className="flex items-center gap-1.5 col-span-2 sm:col-span-3 text-[11px] text-[#483328] pt-1 border-t border-[#ede0d2]">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Pavilion: <strong className="text-[#1d0f09]">{booking.seating}</strong></span>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.notes && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[#2d1a10] mb-3 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <p className="leading-tight">
                      <strong className="text-amber-900">Notes:</strong> {booking.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-[#ede0d2] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] text-[#5e3810] font-mono">
                  Received {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(booking.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1.5">
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'CONFIRMED')}
                      disabled={updatingId === booking._id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  )}

                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'COMPLETED')}
                      disabled={updatingId === booking._id}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Complete Visit</span>
                    </button>
                  )}

                  {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'CANCELLED')}
                      disabled={updatingId === booking._id}
                      className="px-2.5 py-1.5 rounded-xl bg-[#fdfaf6] hover:bg-rose-50 border border-[#ede0d2] hover:border-rose-300 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
