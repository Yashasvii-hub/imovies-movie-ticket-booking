import React from 'react';
import { X, CheckCircle, QrCode, Printer, Calendar, Clock, MapPin, Ticket } from 'lucide-react';

export const TicketModal = ({
  isOpen,
  onClose,
  booking,
  onViewHistory
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-rose-500/30 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-center text-white">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-white" />
            Booking Confirmed!
          </div>
          <p className="text-[11px] text-emerald-100 opacity-90 mt-0.5">
            Your e-ticket has been generated and seats reserved.
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 bg-slate-900/90 text-slate-200 space-y-5">
          {/* Movie Info */}
          <div className="flex gap-4 items-center">
            {booking.moviePoster && (
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                className="w-16 h-22 object-cover rounded-xl shadow-md border border-slate-700"
              />
            )}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                E-Ticket Voucher
              </span>
              <h3 className="text-lg font-extrabold text-white leading-tight">
                {booking.movieTitle}
              </h3>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {booking.theaterName}
              </div>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Date</div>
              <div className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                {booking.showDate}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Showtime</div>
              <div className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                {booking.showTime}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase">Screen</div>
              <div className="font-semibold text-white mt-0.5">{booking.screenName}</div>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase">Seats</div>
              <div className="font-bold text-rose-400 mt-0.5">
                {booking.seats?.map(s => s.seatNumber).join(', ')}
              </div>
            </div>
          </div>

          {/* Reference & QR Code */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white text-slate-900">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Booking Reference
              </div>
              <div className="text-lg font-black tracking-widest font-mono text-slate-900">
                {booking.bookingReference}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                TXN: {booking.paymentDetails?.transactionId || 'COMPLETED'}
              </div>
            </div>
            {/* High visual QR Code simulation */}
            <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center p-1">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
          </div>

          {/* Pricing info */}
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span>Total Amount Paid</span>
            <span className="text-base font-bold text-emerald-400">₹{booking.totalAmount}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              Print Ticket
            </button>
            <button
              onClick={() => { onClose(); onViewHistory(); }}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-md shadow-rose-950/50"
            >
              <Ticket className="w-4 h-4" />
              My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
