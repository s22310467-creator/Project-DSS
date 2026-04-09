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
        <div className="hidden md:flex items-center gap-3 bg-white/50 border border-emerald-100 px-4 py-2 rounded-xl w-80 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search className="w-4 h-4 text-emerald-600" />
          <input 
            type="text" 
            placeholder="Cari data..." 
            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-emerald-300 w-full"
          />
        </div>

        {/* Bagian Kanan: User Info & Notif */}
        <div className="flex items-center gap-6">
          {/* Tanggal (Hidden di mobile) */}
          <div className="hidden lg:flex items-center gap-2 text-emerald-800/70 border-r border-emerald-100 pr-6">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">{today}</span>
          </div>

          {/* Notifikasi */}
          <button className="relative p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-emerald-100">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Admin Ganteng</p>
              <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-tighter">Front-End Developer</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-md border-2 border-white">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;