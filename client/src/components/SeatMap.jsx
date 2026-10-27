import React from 'react';
import { Monitor } from 'lucide-react';

export const SeatMap = ({
  showtime,
  selectedSeats,
  onToggleSeat
}) => {
  if (!showtime) return null;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 10;

  const bookedSeats = showtime.bookedSeats || [];
  const lockedSeats = (showtime.lockedSeats || []).map(l => l.seatNumber);

  const getSeatTier = (row) => {
    if (['A', 'B', 'C'].includes(row)) return { name: 'Standard', price: showtime.pricing?.standard || 250, className: 'seat-available-standard' };
    if (['D', 'E'].includes(row)) return { name: 'Premium', price: showtime.pricing?.premium || 350, className: 'seat-available-premium' };
    return { name: 'VIP Recliner', price: showtime.pricing?.vip || 500, className: 'seat-available-vip' };
  };

  const getSeatState = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return 'booked';
    if (selectedSeats.some(s => s.seatNumber === seatNum)) return 'selected';
    if (lockedSeats.includes(seatNum)) return 'locked';
    return 'available';
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {/* Cinema Screen Indicator */}
      <div className="screen-container mb-12 text-center">
        <div className="cinema-screen max-w-xl mx-auto"></div>
        <p className="text-[11px] font-bold tracking-widest uppercase text-sky-400 mt-3 flex items-center justify-center gap-1.5 opacity-80">
          <Monitor className="w-3.5 h-3.5" />
          Cinema Projection Screen — All Eyes This Way
        </p>
      </div>

      {/* Seat Rows Layout */}
      <div className="space-y-3 flex flex-col items-center">
        {rows.map((row) => {
          const tier = getSeatTier(row);

          return (
            <div key={row} className="flex items-center gap-3">
              {/* Row Label */}
              <span className="w-6 text-center font-bold text-xs text-slate-400 select-none">
                {row}
              </span>

              {/* Seats in this row */}
              <div className="flex items-center gap-2">
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatNum = `${row}${i + 1}`;
                  const state = getSeatState(seatNum);

                  let stateClass = tier.className;
                  if (state === 'selected') stateClass = 'seat-selected';
                  else if (state === 'booked') stateClass = 'seat-booked';
                  else if (state === 'locked') stateClass = 'seat-locked';

                  return (
                    <button
                      key={seatNum}
                      disabled={state === 'booked' || state === 'locked'}
                      onClick={() => onToggleSeat({
                        seatNumber: seatNum,
                        tier: tier.name,
                        price: tier.price
                      })}
                      className={`seat-btn ${stateClass}`}
                      title={`${seatNum} (${tier.name} - ₹${tier.price})`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="w-6 text-center font-bold text-xs text-slate-400 select-none">
                {row}
              </span>
            </div>
          );
        })}
      </div>

      {/* Seat Legend */}
      <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="seat-btn seat-available-standard cursor-default"></div>
          <span>Standard (₹{showtime.pricing?.standard || 250})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat-btn seat-available-premium cursor-default"></div>
          <span>Premium (₹{showtime.pricing?.premium || 350})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat-btn seat-available-vip cursor-default"></div>
          <span>VIP (₹{showtime.pricing?.vip || 500})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat-btn seat-selected cursor-default"></div>
          <span className="text-rose-400 font-semibold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat-btn seat-booked cursor-default"></div>
          <span className="text-slate-500">Booked</span>
        </div>
      </div>
    </div>
  );
};
