import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, DollarSign, Ticket, Film, Users, PlusCircle, Database, Check, Clock } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Movie Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newGenre, setNewGenre] = useState('Action, Sci-Fi');
  const [newDuration, setNewDuration] = useState('145');
  const [newRating, setNewRating] = useState('8.5');
  const [newPoster, setNewPoster] = useState('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80');
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminBookings()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    setFormMsg('');

    try {
      const res = await api.createMovie({
        title: newTitle,
        description: newDesc,
        genre: newGenre.split(',').map(s => s.trim()),
        duration: Number(newDuration),
        rating: Number(newRating),
        posterUrl: newPoster
      });

      if (res.success) {
        setFormMsg('Movie added to IMovies catalog successfully!');
        setShowAddModal(false);
        setNewTitle('');
        setNewDesc('');
        await loadDashboardData();
      } else {
        setFormMsg(res.message || 'Failed to add movie.');
      }
    } catch (err) {
      setFormMsg('Error submitting movie.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-sm">
        Loading cinema management analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            Cinema Administration & Control Center
          </div>
          <h1 className="text-2xl font-extrabold text-white">IMovies Management Portal</h1>
          <p className="text-xs text-slate-400">Real-time box office analytics, catalog management, and ticketing logs</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/50 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Movie
          </button>
        </div>
      </div>

      {formMsg && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <span>{formMsg}</span>
          <button onClick={() => setFormMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{stats?.totalRevenue?.toLocaleString() || 0}
          </div>
          <div className="text-[11px] text-slate-500">Gross box office earnings</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Confirmed Bookings</span>
            <Ticket className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats?.totalBookings || 0}
          </div>
          <div className="text-[11px] text-slate-500">{stats?.totalTicketsSold || 0} tickets sold</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Movies</span>
            <Film className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats?.totalMovies || 0}
          </div>
          <div className="text-[11px] text-slate-500">Scheduled across theaters</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats?.totalUsers || 0}
          </div>
          <div className="text-[11px] text-slate-500">Customer accounts</div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-rose-400" />
          <span className="text-slate-300">Persistence Engine:</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-mono font-bold">
            {stats?.dbMode || 'Active'}
          </span>
        </div>
        <div className="text-emerald-400 flex items-center gap-1 font-semibold">
          <Check className="w-3.5 h-3.5" />
          Ticketing Engine Online
        </div>
      </div>

      {/* System Bookings Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-rose-500" />
            Recent Box Office Transactions
          </h3>
          <span className="text-xs text-slate-400">Total: {bookings.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Reference</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Movie</th>
                <th className="p-3.5">Showtime</th>
                <th className="p-3.5">Seats</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-mono text-rose-400 font-semibold">
                      {b.bookingReference}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{b.userId?.name || 'Customer'}</div>
                      <div className="text-[10px] text-slate-500">{b.userId?.email || 'user@imovies.com'}</div>
                    </td>
                    <td className="p-3.5 font-medium text-white">{b.movieTitle}</td>
                    <td className="p-3.5 text-slate-400">
                      {b.showDate} at {b.showTime}
                    </td>
                    <td className="p-3.5 font-mono text-amber-300">
                      {b.seats?.map(s => s.seatNumber).join(', ')}
                    </td>
                    <td className="p-3.5 font-bold text-white">₹{b.totalAmount}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        b.bookingStatus === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 overflow-hidden shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Add New Movie to Box Office</h3>
            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Gladiator II"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Synopsis / Description</label>
                <textarea
                  required
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Movie plot..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={newPoster}
                  onChange={(e) => setNewPoster(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
