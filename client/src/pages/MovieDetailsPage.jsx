import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Star, Clock, Calendar, MapPin, Ticket, ShieldAlert } from 'lucide-react';

export const MovieDetailsPage = ({
  movie,
  onBack,
  onSelectShowtime
}) => {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);

  // Available dates: Today and Tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const dates = [
    { label: 'Today', value: today },
    { label: 'Tomorrow', value: tomorrow }
  ];

  useEffect(() => {
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (movie?._id && selectedDate) {
      loadShowtimes();
    }
  }, [movie, selectedDate]);

  const loadShowtimes = async () => {
    try {
      setLoadingShowtimes(true);
      const res = await api.getShowtimes({
        movieId: movie._id,
        date: selectedDate
      });
      if (res.success) {
        setShowtimes(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingShowtimes(false);
    }
  };

  // Group showtimes by theater
  const theatersMap = {};
  showtimes.forEach((st) => {
    const theaterId = st.theaterId?._id || 'default';
    if (!theatersMap[theaterId]) {
      theatersMap[theaterId] = {
        name: st.theaterId?.name || 'Grand Multiplex',
        location: st.theaterId?.location || 'Downtown Sector 18',
        city: st.theaterId?.city || 'Metropolis',
        showtimes: []
      };
    }
    theatersMap[theaterId].showtimes.push(st);
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Movies
      </button>

      {/* Movie Details Header */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row gap-8 items-start">
        {/* Poster */}
        <div className="w-full md:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
              {movie.language}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{movie.rating}/10</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{movie.duration} minutes</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white">
            {movie.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {movie.description}
          </p>

          <div className="space-y-2 pt-2 text-xs border-t border-slate-800/80">
            <div>
              <span className="text-slate-500">Director: </span>
              <span className="text-slate-300 font-medium">{movie.director}</span>
            </div>
            <div>
              <span className="text-slate-500">Cast: </span>
              <span className="text-slate-300 font-medium">{movie.cast?.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500">Genres: </span>
              <span className="text-slate-300 font-medium">{movie.genre?.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-rose-500" />
              Select Showtime & Cinema
            </h2>
            <p className="text-xs text-slate-400">Choose your preferred screening hall and showtime slot</p>
          </div>

          {/* Date Selector Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedDate === d.value
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {d.label} ({d.value})
              </button>
            ))}
          </div>
        </div>

        {/* Theaters List */}
        {loadingShowtimes ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading available showtimes...
          </div>
        ) : Object.keys(theatersMap).length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm border border-slate-800">
            No showtimes scheduled for this date. Please check the other date.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(theatersMap).map((theater, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{theater.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {theater.location}, {theater.city}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold self-start sm:self-auto">
                    M-Ticket & Food Delivery Available
                  </div>
                </div>

                {/* Showtimes Buttons */}
                <div className="flex flex-wrap gap-3">
                  {theater.showtimes.map((st) => (
                    <button
                      key={st._id}
                      onClick={() => onSelectShowtime(st, movie)}
                      className="group p-3 rounded-xl bg-slate-900 hover:bg-rose-600/10 border border-slate-800 hover:border-rose-500/50 text-left transition flex flex-col justify-between min-w-[130px]"
                    >
                      <div className="font-bold text-sm text-white group-hover:text-rose-400 transition">
                        {st.time}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                        {st.format}
                      </div>
                      <div className="text-[11px] font-semibold text-rose-400 mt-1.5">
                        from ₹{st.pricing?.standard || 250}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
