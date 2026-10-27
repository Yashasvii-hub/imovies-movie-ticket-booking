import React from 'react';
import { Star, Clock, Ticket } from 'lucide-react';

export const MovieCard = ({ movie, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(movie)}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col group border border-slate-800"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/30 flex items-center gap-1 text-xs font-bold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-900/50">
            <Ticket className="w-4 h-4" />
            Book Tickets
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-rose-400 transition truncate">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {movie.duration} min
            </span>
            <span>•</span>
            <span className="truncate">{movie.language}</span>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {movie.genre?.slice(0, 2).map((g, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-medium text-slate-300 border border-slate-700/50"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
