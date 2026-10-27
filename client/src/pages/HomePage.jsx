import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Search, Sparkles, Film, Flame } from 'lucide-react';

export const HomePage = ({ onSelectMovie }) => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  const genres = ['All', 'Action', 'Sci-Fi', 'Biography', 'Drama', 'Adventure', 'Animation'];

  useEffect(() => {
    loadMovies();
  }, [searchTerm, selectedGenre]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      const res = await api.getMovies(params);
      if (res.success) {
        setMovies(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const featured = movies[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase Section */}
      {featured && !searchTerm && selectedGenre === 'All' && (
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl min-h-[420px] flex items-end p-6 md:p-12">
          {/* Backdrop Image with gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={featured.backdropUrl}
              alt={featured.title}
              className="w-full h-full object-cover object-center filter brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-rose-400" />
              Now Trending Blockbuster
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featured.title}
            </h1>
            <p className="text-sm md:text-base text-slate-300 line-clamp-2 leading-relaxed">
              {featured.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectMovie(featured)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-rose-950/60 flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                Book Tickets Now
              </button>
              <div className="text-xs text-slate-400">
                ⭐ <strong className="text-white">{featured.rating}</strong>/10 • {featured.duration} mins • {featured.language}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              Now Showing in Theaters
            </h2>
            <p className="text-xs text-slate-400">Select a film to browse showtimes and reserve your seats</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies, actors, directors..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition shadow-inner"
            />
          </div>
        </div>

        {/* Genre Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedGenre === g
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-rose-500" />
          Loading movies from IMovies catalog...
        </div>
      ) : movies.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-sm">
          No movies found matching your query. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onSelect={onSelectMovie}
            />
          ))}
        </div>
      )}
    </div>
  );
};
