import React from 'react';
import { Search, Bell, User, Calendar } from 'lucide-react';

const Navbar = () => {
  // Mendapatkan tanggal hari ini untuk memperkuat kesan sistem real-time
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <nav className="sticky top-0 z-40 w-full px-6 py-4">
      <div className="glass-card bg-white/60 backdrop-blur-lg border border-white/40 shadow-sm px-6 py-3 flex items-center justify-between">
        
        {/* Bagian Kiri: Search Bar */}
        <div className="hidden md:flex items-center gap-3 bg-white">
        </div>

        {/* Bagian Kanan: User Info & Notif */}
        <div className="flex items-center gap-6">
          {/* Tanggal (Hidden di mobile) */}
          <div className="hidden lg:flex items-center gap-2 text-emerald-800">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">{today}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;