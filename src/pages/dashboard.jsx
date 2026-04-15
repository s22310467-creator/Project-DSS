// src/pages/Dashboard.jsx
import React from 'react';
import { LayoutDashboard, Target, Users, BarChart3, TrendingUp, Download } from 'lucide-react';

// ================= TAMBAHAN =================
import { useNavigate } from 'react-router-dom';
// ================= END TAMBAHAN =================

const Dashboard = () => {

  // ================= TAMBAHAN =================
  const navigate = useNavigate();
  // ================= END TAMBAHAN =================

  // Data dummy untuk contoh tampilan
  const summaryStats = [
    { id: 1, name: 'Total Kriteria', value: '5', icon: Target, color: 'text-teal-600', path: '/kriteria' },
    { id: 2, name: 'Total Supplier', value: '12', icon: Users, color: 'text-emerald-600', path: '/supplier' },
    { id: 3, name: 'Status Konsistensi AHP', value: 'Konsisten', icon: TrendingUp, color: 'text-green-600', path: '/ahp' },
  ];

  const topSuppliers = [
    { rank: 1, name: 'PT. Maju Mapan Jaya', score: '0.945' },
    { rank: 2, name: 'CV. Sejahtera Abadi', score: '0.882' },
    { rank: 3, name: 'Firma Sumber Makmur', score: '0.810' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header Halaman */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-inner">
            <LayoutDashboard className="w-8 h-8 text-teal-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Ringkasan Sistem Pendukung Keputusan Pemilihan Supplier</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 glass-card bg-teal-600/10 hover:bg-teal-600/20 text-teal-800 transition-all duration-300 font-medium">
          <Download className="w-4 h-4" />
          Export Laporan Cepat
        </button>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryStats.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              onClick={() => navigate(item.path)}
              className="glass-card p-6 flex items-start gap-5 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <div className={`p-4 rounded-xl bg-white/80 border border-white/50 ${item.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">{item.name}</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-1">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Konten Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 glass-card p-7 space-y-5">
          <div className="flex items-center gap-3 justify-between">
            <div className='flex items-center gap-3'>
              <BarChart3 className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-800">Visualisasi Peringkat Supplier</h2>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-white/50 px-2 py-1 rounded">Method: AHP + SAW</span>
          </div>
          
          <div className="w-full h-80 bg-white/50 rounded-xl border border-white/20 flex items-center justify-center border-dashed">
            <div className='text-center text-gray-400'>
              <BarChart3 className='w-16 h-16 mx-auto mb-3 opacity-50'/>
              <p className='font-medium'>Grafik Batang Skor Akhir</p>
              <p className='text-sm'>(Integrasikan Chart.js/Recharts di sini nanti)</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-7 space-y-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-800">Top 3 Supplier Terbaik</h2>
          </div>
          
          <div className="space-y-4">
            {topSuppliers.map((sup) => (
              <div key={sup.rank} className="flex items-center gap-4 p-4 bg-white/70 rounded-xl border border-white/50 shadow-sm transition-all hover:bg-white">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border-2 
                  ${sup.rank === 1 ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-inner' : 
                    sup.rank === 2 ? 'bg-slate-100 border-slate-300 text-slate-800' : 
                    'bg-orange-100 border-orange-300 text-orange-900'}`}
                >
                  #{sup.rank}
                </div>

                <div className='flex-1'>
                  <p className="font-semibold text-gray-900 truncate">{sup.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Skor Akhir: <span className='font-mono font-bold text-teal-700'>{sup.score}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full text-center py-3 text-sm font-medium text-teal-800 bg-teal-100/50 rounded-lg hover:bg-teal-100 transition border border-teal-200/50">
            Lihat Semua Peringkat
          </button>
        </div>
      </div>

      {/* Langkah Cepat */}
      <div className="glass-card p-7">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Langkah Cepat Analisis</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-sm font-medium text-teal-900">
          <div className="p-4 bg-white/60 rounded-lg border border-teal-100 hover:border-teal-200">1. Input Kriteria</div>
          <div className="p-4 bg-white/60 rounded-lg border border-teal-100 hover:border-teal-200">2. Bobot AHP</div>
          <div className="p-4 bg-white/60 rounded-lg border border-teal-100 hover:border-teal-200">3. Data Supplier</div>
          <div className="p-4 bg-white/60 rounded-lg border border-teal-100 hover:border-teal-200">4. Nilai SAW</div>
          <div className="p-4 bg-emerald-600 text-white rounded-lg shadow-md font-bold">5. Selesai!</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;