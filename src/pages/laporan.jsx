import React from 'react';
import { FileText, Download, Trophy, Medal, Award, Printer, Share2 } from 'lucide-react';

const Laporan = () => {
  // Data dummy hasil akhir (Setelah perhitungan SAW bobot kriteria * nilai normalisasi)
  const rankingData = [
    { rank: 1, nama: 'PT. Maju Jaya', skor: '0.985', status: 'Sangat Direkomendasikan' },
    { rank: 2, nama: 'CV. Sumber Makmur', skor: '0.842', status: 'Direkomendasikan' },
    { rank: 3, nama: 'Firma Global Tech', skor: '0.710', status: 'Dipertimbangkan' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 glass-card bg-emerald-500/10 border-emerald-200 text-emerald-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan Hasil Akhir</h1>
            <p className="text-sm text-gray-500">Hasil pemeringkatan supplier menggunakan metode AHP-SAW.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all text-sm font-semibold">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all font-bold">
            <Download className="w-5 h-5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Podium Visual (Juara 1) */}
      <div className="glass-card p-8 bg-gradient-to-br from-emerald-600/10 via-transparent to-teal-600/5 border-emerald-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="w-40 h-40 text-emerald-600" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-amber-100 rounded-full border-4 border-white shadow-xl">
            <Trophy className="w-12 h-12 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] font-black text-emerald-800/60">Supplier Terbaik</h2>
            <p className="text-4xl font-black text-gray-800 mt-1">{rankingData[0].nama}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/80 rounded-full border border-emerald-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase">Skor Akhir:</span>
            <span className="text-lg font-mono font-black text-emerald-700">{rankingData[0].skor}</span>
          </div>
        </div>
      </div>

      {/* Tabel Perankingan Lengkap */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/40 flex justify-between items-center bg-white/20">
          <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs flex items-center gap-2">
            <Medal className="w-4 h-4 text-emerald-600" /> Daftar Peringkat Keseluruhan
          </h3>
          <span className="text-[10px] font-medium text-gray-400">Data diperbarui secara otomatis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 text-center w-24">Peringkat</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500">Nama Supplier</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 text-center">Skor Akhir</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500">Keterangan</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {rankingData.map((item, index) => (
                <tr key={index} className={`transition-all ${index === 0 ? 'bg-emerald-50/30' : 'hover:bg-white/40'}`}>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black 
                      ${index === 0 ? 'bg-amber-400 text-white shadow-md ring-4 ring-amber-100' : 
                        index === 1 ? 'bg-slate-300 text-white' : 
                        index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {item.rank}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-800">{item.nama}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Verified Supplier</p>
                  </td>
                  <td className="px-6 py-5 text-center font-mono font-bold text-emerald-700 text-lg">
                    {item.skor}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border
                      ${index === 0 ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors">
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Laporan (Metadata untuk PDF) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-emerald-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Award className="w-4 h-4" />
          <span>Sistem Pendukung Keputusan • Metode SAW • Vite React v1.0</span>
        </div>
        <p className="text-[10px] text-emerald-800 font-medium px-3 py-1 bg-emerald-50 rounded-full">
          Dicetak oleh Admin pada {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Laporan;