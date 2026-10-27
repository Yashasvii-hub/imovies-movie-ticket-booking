import React from 'react';
import { Film, Heart, ShieldCheck, Code } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-20 py-8 px-4 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-rose-500" />
          <span className="font-semibold text-slate-300">IMovies — Movie Ticket Booking Made Simple</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" /> for Skill Wallet Project Evaluation
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            PCI-DSS Simulated Gateway
          </span>
          <a 
            href="https://github.com/Yashasvii-hub/imovies-movie-ticket-booking" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition"
          >
            <Code className="w-4 h-4 text-rose-400" />
            GitHub: Yashasvii-hub
          </a>
        </div>
      </div>
    </footer>
  );
};

