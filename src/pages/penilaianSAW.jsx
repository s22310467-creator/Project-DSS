import React, { useState } from 'react';
import { ClipboardCheck, Calculator, Save, Info, ArrowRight } from 'lucide-react';

const PenilaianSAW = () => {
  // Dummy data (Nantinya diambil dari state Kriteria & Supplier)
  const kriteria = [
    { kode: 'C1', nama: 'Harga', tipe: 'Cost' },
    { kode: 'C2', nama: 'Kualitas', tipe: 'Benefit' },
    { kode: 'C3', nama: 'Pelayanan', tipe: 'Benefit' }
  ];

  const suppliers = [
    { id: 1, nama: 'PT. Maju Jaya' },
    { id: 2, nama: 'CV. Sumber Makmur' },
    { id: 3, nama: 'Firma Global Tech' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 glass-card bg-emerald-500/10 border-emerald-200 text-emerald-700">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Penilaian Supplier (SAW)</h1>
            <p className="text-sm text-gray-500">Berikan nilai performa untuk setiap supplier berdasarkan kriteria.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all font-bold">
            <Save className="w-4 h-4" /> Simpan Draft
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all font-bold">
            <Calculator className="w-4 h-4" /> Hitung Normalisasi
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="glass-card p-4 bg-blue-50/50 border-blue-200 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-xs text-blue-900 leading-relaxed">
          Masukkan nilai mentah (misal: Harga dlm Rupiah, atau skala 1-100). Sistem akan melakukan <b>Normalisasi</b> otomatis berdasarkan tipe kriteria (Benefit/Cost) setelah Anda menekan tombol hitung.
        </p>
      </div>

      {/* Matriks Keputusan (Input Nilai Mentah) */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/40 bg-white/20">
          <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Matriks Keputusan (X)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-500/5 text-emerald-900">
                <th className="px-6 py-4 text-xs font-black uppercase border-b border-emerald-100">Supplier</th>
                {kriteria.map((k) => (
                  <th key={k.kode} className="px-6 py-4 text-xs font-black uppercase border-b border-emerald-100 text-center">
                    {k.nama} 
                    <span className={`block text-[9px] mt-1 px-1 rounded ${k.tipe === 'Benefit' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                      {k.tipe}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {suppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-700 bg-emerald-50/20">{sup.nama}</td>
                  {kriteria.map((k) => (
                    <td key={k.kode} className="px-6 py-4">
                      <input 
                        type="number"
                        placeholder="Nilai..."
                        className="w-full text-center p-2 bg-white/70 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriks Ternormalisasi (Preview Hasil Poin 7) */}
      <div className="glass-card overflow-hidden opacity-60">
        <div className="p-5 border-b border-white/40 bg-emerald-600/5 flex justify-between items-center">
          <h3 className="font-bold text-emerald-900 uppercase tracking-wider text-sm">Matriks Ternormalisasi (R)</h3>
          <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-1 rounded-md font-bold italic">Preview Otomatis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 bg-gray-50/50">
                <th className="px-6 py-3 text-[10px] font-bold uppercase">Supplier</th>
                {kriteria.map((k) => (
                  <th key={k.kode} className="px-6 py-3 text-[10px] font-bold uppercase text-center">{k.kode}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((sup) => (
                <tr key={sup.id} className="border-t border-emerald-50">
                  <td className="px-6 py-3 text-sm text-gray-400 font-medium">{sup.nama}</td>
                  {kriteria.map((k) => (
                    <td key={k.kode} className="px-6 py-3 text-center font-mono text-sm text-emerald-600">
                      0.00
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button Ke Halaman Laporan */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 text-emerald-700 font-bold hover:gap-3 transition-all">
          Lihat Peringkat Akhir <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PenilaianSAW;