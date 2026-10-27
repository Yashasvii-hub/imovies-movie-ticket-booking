import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Film, Ticket, Shield, LogOut, User, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, openAuthModal }) => {
  const { user, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="glass-panel sticky top-0 z-40 border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => { setCurrentView('home'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:scale-105 transition">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
              IMOVIES
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-rose-500">
              Ticket Booking
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`text-sm font-medium transition ${
              currentView === 'home' ? 'text-rose-400 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Movies
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                currentView === 'history' ? 'text-rose-400 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Ticket className="w-4 h-4" />
              My Bookings
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                currentView === 'admin'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                  : 'bg-rose-950/40 text-rose-400 border border-rose-800/50 hover:bg-rose-900/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          )}
        </div>

        {/* Auth / Profile Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => quickDemoLogin('user')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium border border-amber-500/30 transition shadow-sm"
                title="1-Click Login as Evaluator Demo User"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Demo User
              </button>
              <button
                onClick={() => quickDemoLogin('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-medium border border-rose-500/30 transition shadow-sm"
                title="1-Click Login as Cinema Admin"
              >
                <Shield className="w-3.5 h-3.5" />
                Demo Admin
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition shadow-md shadow-rose-950/50"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-200">{user?.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-slate-800 mt-3 space-y-3">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-sm font-medium"
          >
            Movies
          </button>
          {isAuthenticated && (
            <button
              onClick={() => { setCurrentView('history'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-sm font-medium"
            >
              My Bookings
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg bg-rose-950/40 text-rose-400 text-sm font-semibold"
            >
              Admin Portal
            </button>
          )}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => { quickDemoLogin('user'); setMobileMenuOpen(false); }}
                  className="w-full py-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold"
                >
                  Quick Demo User Login
                </button>
                <button
                  onClick={() => { quickDemoLogin('admin'); setMobileMenuOpen(false); }}
                  className="w-full py-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold"
                >
                  Quick Demo Admin Login
                </button>
                <button
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold"
                >
                  Sign In / Register
                </button>
              </>
            ) : (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg bg-slate-800 text-rose-400 text-sm font-semibold"
              >
                Sign Out ({user?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
