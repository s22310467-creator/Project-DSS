import React, { useState } from 'react';
import { Scale, Info, RefreshCw, CheckCircle2 } from 'lucide-react';

const AnalisisAHP = () => {
  // Contoh data kriteria yang diambil dari state/backend
  const kriteria = ['Harga', 'Kualitas', 'Pelayanan', 'Garansi'];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center gap-3">
        <div className="p-3 glass-card bg-teal-500/10 border-teal-200 text-teal-700">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analisis Perbandingan Kriteria (AHP)</h1>
          <p className="text-sm text-gray-500">Bandingkan tingkat kepentingan antar kriteria (Skala Saaty 1-9).</p>
        </div>
      </div>

      {/* Instruksi Glassmorphism */}
      <div className="glass-card p-4 bg-amber-50/50 border-amber-200 flex gap-3 items-start">
        <Info className="w-5 h-5 text-amber-600 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <b>Cara Mengisi:</b> Pilih angka 1 jika kedua kriteria sama penting. Pilih angka lebih besar jika kriteria di sebelah kiri lebih penting daripada kriteria di atas, dan sebaliknya.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Kolom Kiri: Matriks Input */}
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            Matriks Perbandingan Berpasangan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-emerald-500/10 border border-emerald-100 text-emerald-800 text-sm italic">Kriteria</th>
                  {kriteria.map((k) => (
                    <th key={k} className="p-3 bg-emerald-500/10 border border-emerald-100 text-emerald-800 text-sm uppercase">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kriteria.map((row, rowIndex) => (
                  <tr key={row}>
                    <td className="p-3 bg-emerald-500/10 border border-emerald-100 text-emerald-900 font-bold text-sm uppercase">{row}</td>
                    {kriteria.map((col, colIndex) => {
                      // Jika diagonal (A vs A), nilai otomatis 1 dan di-disable
                      const isDiagonal = rowIndex === colIndex;
                      const isLowerTriangle = rowIndex > colIndex;

                      return (
                        <td key={col} className="border border-emerald-50 p-2 text-center">
                          <input
                            type="number"
                            disabled={isDiagonal || isLowerTriangle}
                            className={`w-16 p-2 text-center text-sm rounded-lg border outline-none transition-all
                              ${isDiagonal ? 'bg-gray-100 text-gray-400 border-gray-200' : 
                                isLowerTriangle ? 'bg-emerald-50/30 text-emerald-400 border-transparent italic' : 
                                'bg-white border-emerald-100 focus:ring-2 focus:ring-emerald-500/20'}`}
                            defaultValue={isDiagonal ? 1 : ""}
                            placeholder={isLowerTriangle ? "inv" : "-"}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex gap-3">
            <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Hitung Bobot Prioritas
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Hasil Bobot (Poin 5) */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hasil Bobot Prioritas</h3>
            <div className="space-y-4">
              {/* Progress Bar Style untuk Bobot */}
              {kriteria.map((k, i) => (
                <div key={k} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-700">{k}</span>
                    <span className="text-emerald-700 font-bold">25.0%</span>
                  </div>
                  <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Konsistensi Rasio */}
          <div className="glass-card p-5 bg-white/40 flex items-center justify-between border-emerald-200">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Consistency Ratio (CR)</p>
              <p className="text-2xl font-black text-emerald-800">0.042</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4" /> Konsisten
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisAHP;