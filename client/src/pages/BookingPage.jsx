import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SeatMap } from '../components/SeatMap';
import { PaymentModal } from '../components/PaymentModal';
import { TicketModal } from '../components/TicketModal';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Ticket, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const BookingPage = ({
  showtime: initialShowtime,
  movie,
  onBack,
  onViewHistory,
  openAuthModal
}) => {
  const { isAuthenticated } = useAuth();
  const [showtime, setShowtime] = useState(initialShowtime);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocking, setIsLocking] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Refresh live seat status on load
  useEffect(() => {
    refreshShowtime();
  }, [initialShowtime?._id]);

  const refreshShowtime = async () => {
    try {
      const res = await api.getShowtimeById(initialShowtime._id);
      if (res.success) {
        setShowtime(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSeat = (seatObj) => {
    setErrorMsg('');
    const exists = selectedSeats.some(s => s.seatNumber === seatObj.seatNumber);
    if (exists) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seatObj.seatNumber));
    } else {
      if (selectedSeats.length >= 6) {
        setErrorMsg('Maximum 6 tickets can be reserved per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatObj]);
    }
  };

  const handleProceedToPayment = async () => {
    setErrorMsg('');

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least one seat to proceed.');
      return;
    }

    try {
      setIsLocking(true);
      const seatNumbers = selectedSeats.map(s => s.seatNumber);
      const res = await api.lockSeats(showtime._id, seatNumbers);

      if (res.success) {
        setPaymentModalOpen(true);
      } else {
        setErrorMsg(res.message || 'Could not lock selected seats. Please choose different seats.');
        await refreshShowtime();
      }
    } catch (err) {
      setErrorMsg('Failed to lock seats. Please check your connection.');
    } finally {
      setIsLocking(false);
    }
  };

  const handleConfirmPayment = async ({ paymentMethod }) => {
    try {
      setIsProcessingPayment(true);
      const bookingData = {
        showtimeId: showtime._id,
        seats: selectedSeats,
        paymentMethod
      };

      const res = await api.createBooking(bookingData);

      if (res.success && res.data) {
        setConfirmedBooking(res.data);
        setPaymentModalOpen(false);
        setTicketModalOpen(true);
        setSelectedSeats([]);
      } else {
        setErrorMsg(res.message || 'Payment simulation failed.');
        setPaymentModalOpen(false);
      }
    } catch (err) {
      setErrorMsg('Booking processing failed. Please try again.');
      setPaymentModalOpen(false);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Change Showtime
        </button>

        <div className="text-right">
          <h2 className="text-base font-extrabold text-white">{movie?.title}</h2>
          <div className="text-xs text-slate-400">
            {showtime?.theaterId?.name || 'Cineplex'} • {showtime?.date} at {showtime?.time}
          </div>
        </div>
      </div>

      {/* Error notification if any */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 max-w-xl mx-auto animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Seat Map Layout Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-2xl">
        <SeatMap
          showtime={showtime}
          selectedSeats={selectedSeats}
          onToggleSeat={handleToggleSeat}
        />
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 glass-panel border-t border-slate-800 p-4 shadow-2xl backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">
              Selected: <strong className="text-white">{selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(', ') : 'None'}</strong>
            </div>
            <div className="text-lg font-black text-rose-400">
              ₹{subtotal}
              <span className="text-[11px] font-normal text-slate-400 ml-1.5">+ taxes</span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0 || isLocking}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-950/60 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLocking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Reserving Seats...
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                Proceed to Checkout ({selectedSeats.length})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        showtime={showtime}
        movie={movie}
        selectedSeats={selectedSeats}
        onConfirmPayment={handleConfirmPayment}
        isProcessing={isProcessingPayment}
      />

      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        booking={confirmedBooking}
        onViewHistory={onViewHistory}
      />
    </div>
  );
};
