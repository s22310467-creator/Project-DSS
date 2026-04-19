/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Target, Users, BarChart3, TrendingUp, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
// Import Recharts untuk visualisasi
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [counts, setCounts] = useState({ kriteria: 0, subKriteria: 0, suppliers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil Data Hasil Akhir (Ranking) untuk Chart
    const rankRef = ref(db, 'hasil_akhir');
    onValue(rankRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRanking(Object.values(data));
      }
    });

    // 2. Ambil Statistik Utama
    // Hitung Kriteria
    onValue(ref(db, 'kriteria'), (snap) => {
      setCounts(prev => ({ ...prev, kriteria: snap.exists() ? Object.keys(snap.val()).length : 0 }));
    });

    // Hitung Sub-Kriteria berdasarkan struktur sub_kriteria > [kode unik]
    onValue(ref(db, 'sub_kriteria'), (snap) => {
      setCounts(prev => ({ ...prev, subKriteria: snap.exists() ? Object.keys(snap.val()).length : 0 }));
    });

    // Hitung Total Supplier
    onValue(ref(db, 'suppliers'), (snap) => {
      setCounts(prev => ({ ...prev, suppliers: snap.exists() ? Object.keys(snap.val()).length : 0 }));
      setLoading(false);
    });
  }, []);

  // Konfigurasi Statistik: Warna icon disesuaikan agar konsisten (Teal, Blue, Emerald)
  const summaryStats = [
    { 
      id: 1, 
      name: 'Total Kriteria', 
      value: counts.kriteria, 
      icon: Target, 
      color: 'text-teal-600', 
      bgColor: 'bg-teal-50',
      path: '/kriteria' 
    },
    { 
      id: 2, 
      name: 'Total Sub-Kriteria', 
      value: counts.subKriteria, 
      icon: Database, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      path: '/kriteria' 
    },
    { 
      id: 3, 
      name: 'Total Supplier', 
      value: counts.suppliers, 
      icon: Users, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50',
      path: '/supplier' 
    },
  ];

  const topSuppliers = ranking.slice(0, 3);
  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white shadow-sm rounded-xl border border-emerald-50">
            <LayoutDashboard className="w-8 h-8 text-teal-700" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase">Dashboard</h1>
            <p className="text-gray-500 text-sm font-medium italic">Ringkasan Sistem Pendukung Keputusan Pemilihan Supplier</p>
          </div>
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryStats.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              onClick={() => navigate(item.path)}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer group"
            >
              <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${item.bgColor} ${item.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</p>
                <p className="text-3xl font-black text-gray-900">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Konten Utama (Chart & Top 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 p-7 rounded-[2.5rem] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-3'>
              <BarChart3 className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">Visualisasi Peringkat</h2>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">AHP + SAW Method</span>
          </div>
          
          <div className="w-full h-80 pt-4">
            {ranking.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ranking} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="nama" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Bar dataKey="skor" radius={[8, 8, 0, 0]} barSize={40}>
                    {ranking.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl italic">
                <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-bold">Belum ada data untuk divisualisasikan</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-7 rounded-[2.5rem] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-800">Top 3 Supplier</h2>
          </div>
          
          <div className="space-y-4">
            {topSuppliers.map((sup, index) => (
              <div key={sup.kode} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-50 transition-all hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5">
                <div className={`flex items-center justify-center min-w-[48px] h-12 rounded-full font-black text-lg
                  ${index === 0 ? 'bg-amber-100 text-amber-600' : 
                    index === 1 ? 'bg-slate-100 text-slate-500' : 
                    'bg-orange-100 text-orange-600'}`}
                >
                  #{index + 1}
                </div>
                <div className='flex-1 truncate'>
                  <p className="font-bold text-gray-800 text-sm uppercase truncate">{sup.nama}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    Skor Akhir: <span className='text-emerald-600 font-mono'>{Number(sup.skor).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/laporan')}
            className="w-full py-4 text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition border border-emerald-100"
          >
            Lihat Semua Peringkat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;