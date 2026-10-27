import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Wallet, ShieldCheck, Loader2 } from 'lucide-react';

export const PaymentModal = ({
  isOpen,
  onClose,
  showtime,
  movie,
  selectedSeats,
  onConfirmPayment,
  isProcessing
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [upiId, setUpiId] = useState('evaluator@okaxis');

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = 35;
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + convenienceFee + tax;

  const handlePay = (e) => {
    e.preventDefault();
    onConfirmPayment({
      paymentMethod,
      subtotal,
      convenienceFee,
      tax,
      totalAmount
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h3 className="text-lg font-bold text-white">Simulated Payment Checkout</h3>
            <p className="text-xs text-slate-400">Sandbox gateway for evaluation & testing</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-6">
          {/* Order Summary Recap */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold text-white">{movie?.title}</span>
              <span className="text-rose-400 font-bold">{showtime?.format}</span>
            </div>
            <div className="text-slate-400">
              {showtime?.theaterId?.name || 'Grand Cineplex'} • {showtime?.date} at {showtime?.time}
            </div>
            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
              <span>Seats ({selectedSeats.map(s => s.seatNumber).join(', ')})</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Convenience Fee & Taxes</span>
              <span>₹{convenienceFee + tax}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Payable</span>
              <span className="text-rose-400 font-extrabold">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  paymentMethod === 'card'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-rose-400" />
                Credit / Debit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  paymentMethod === 'upi'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                UPI / QR Pay
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  paymentMethod === 'netbanking'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building className="w-4 h-4 text-sky-400" />
                Net Banking
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  paymentMethod === 'wallet'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                Digital Wallet
              </button>
            </div>
          </div>

          {/* Simulated Input Fields */}
          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Card Number (Simulated)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Expiry</label>
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">CVV</label>
                  <input
                    type="password"
                    defaultValue="888"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs"
              />
            </div>
          )}

          {/* Security badge & Submit */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit Simulated Payment Encryption • Instant Confirmation</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              `Pay ₹${totalAmount} & Confirm Booking`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
