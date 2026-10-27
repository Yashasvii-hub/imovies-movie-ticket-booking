import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const [currentView, setCurrentView] = useState('home'); // home | details | booking | history | admin
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShowtime = (showtime, movie) => {
    setSelectedShowtime(showtime);
    setSelectedMovie(movie);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openAuthModal={openAuth}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-8">
        {currentView === 'home' && (
          <HomePage onSelectMovie={handleSelectMovie} />
        )}

        {currentView === 'details' && selectedMovie && (
          <MovieDetailsPage
            movie={selectedMovie}
            onBack={() => setCurrentView('home')}
            onSelectShowtime={handleSelectShowtime}
          />
        )}

        {currentView === 'booking' && selectedShowtime && selectedMovie && (
          <BookingPage
            showtime={selectedShowtime}
            movie={selectedMovie}
            onBack={() => setCurrentView('details')}
            onViewHistory={() => setCurrentView('history')}
            openAuthModal={openAuth}
          />
        )}

        {currentView === 'history' && (
          <HistoryPage onBrowseMovies={() => setCurrentView('home')} />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
