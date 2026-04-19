import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings2, Users, Scale, ClipboardCheck, FileText, Leaf } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Data Kriteria', icon: Settings2, path: '/kriteria' },
    { name: 'Data Supplier', icon: Users, path: '/supplier' },
    { name: 'Bobot AHP', icon: Scale, path: '/analisis-ahp' },
    { name: 'Penilaian SAW', icon: ClipboardCheck, path: '/penilaian' },
    { name: 'Laporan Akhir', icon: FileText, path: '/laporan' },
  ];

  return (
    <aside className="w-64 min-h-screen sticky top-0 bg-white/30 backdrop-blur-xl border-r border-white/40 flex flex-col shadow-2xl">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-emerald-500 rounded-lg shadow-lg">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-black text-emerald-900 tracking-tighter">DSS APOTEK</span>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/20 shadow-sm' : 'text-gray-600 hover:bg-emerald-50/50'}`}>
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;