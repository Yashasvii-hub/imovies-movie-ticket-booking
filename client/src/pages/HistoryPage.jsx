import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TicketModal } from '../components/TicketModal';
import { Ticket, Calendar, Clock, MapPin, XCircle, Eye, Sparkles } from 'lucide-react';

export const HistoryPage = ({ onBrowseMovies }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getUserBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Reserved seats will be released back to the box office.')) {
      return;
    }

    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        setActionMsg('Booking successfully cancelled. Refund processed to original payment method.');
        await loadBookings();
      }
    } catch (e) {
      setActionMsg('Failed to cancel booking.');
    }
  };

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking);
    setTicketModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Ticket className="w-6 h-6 text-rose-500" />
          My Booking History
        </h1>
        <p className="text-xs text-slate-400">View upcoming tickets, download vouchers, or cancel reservations</p>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-rose-500" />
          Loading your ticket reservations...
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">No Tickets Booked Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't reserved any movie tickets yet. Explore movies now showing and pick your seats!
          </p>
          <button
            onClick={onBrowseMovies}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md shadow-rose-950/50"
          >
            Explore Now Showing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isConfirmed = booking.bookingStatus === 'confirmed';

            return (
              <div
                key={booking._id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex gap-4 items-center">
                  {booking.moviePoster && (
                    <img
                      src={booking.moviePoster}
                      alt={booking.movieTitle}
                      className="w-16 h-22 object-cover rounded-xl shadow border border-slate-700"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {booking.bookingReference}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-base">
                      {booking.movieTitle}
                    </h3>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {booking.theaterName} ({booking.screenName})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {booking.showDate} at {booking.showTime}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 pt-1">
                      Seats: <strong className="text-rose-400">{booking.seats?.map(s => s.seatNumber).join(', ')}</strong> • Total: <strong className="text-white">₹{booking.totalAmount}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                  <button
                    onClick={() => handleViewTicket(booking)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Ticket
                  </button>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-800/40 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        booking={selectedBooking}
        onViewHistory={() => {}}
      />
    </div>
  );
};
