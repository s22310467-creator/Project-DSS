import React, { useState } from 'react';
import { Users, Plus, Search, Trash2, Edit3, ExternalLink, Building2 } from 'lucide-react';

const Supplier = () => {
  // Data dummy untuk tampilan tabel
  const [suppliers, setSuppliers] = useState([
    { id: 1, kode: 'S01', nama: 'PT. Maju Jaya', alamat: 'Jakarta', email: 'info@majujaya.com' },
    { id: 2, kode: 'S02', nama: 'CV. Sumber Makmur', alamat: 'Surabaya', email: 'contact@sm.id' },
    { id: 3, kode: 'S03', nama: 'Firma Global Tech', alamat: 'Bandung', email: 'hello@globaltech.com' },
  ]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 glass-card bg-emerald-500/10 border-emerald-200 text-emerald-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Supplier</h1>
            <p className="text-sm text-gray-500">Kelola daftar supplier yang akan dievaluasi dalam sistem.</p>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200 transition-all font-bold">
          <Plus className="w-5 h-5" />
          Tambah Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Kontrol & Filter */}
        <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input 
              type="text" 
              placeholder="Cari supplier berdasarkan nama atau kode..." 
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <Building2 className="w-3.5 h-3.5" />
            Total: {suppliers.length} Supplier Terdaftar
          </div>
        </div>

        {/* Tabel Data Supplier */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="bg-emerald-500/10 border-b border-emerald-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-emerald-900 uppercase tracking-widest text-center w-20">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-emerald-900 uppercase tracking-widest">Nama Perusahaan</th>
                  <th className="px-6 py-4 text-xs font-bold text-emerald-900 uppercase tracking-widest">Kontak / Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-emerald-900 uppercase tracking-widest">Alamat</th>
                  <th className="px-6 py-4 text-xs font-bold text-emerald-900 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {suppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-white/40 transition-colors group">
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-100">
                        {sup.kode}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{sup.nama}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{sup.email}</span>
                        <ExternalLink className="w-3 h-3 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 italic">{sup.alamat}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button title="Edit" className="p-2 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button title="Hapus" className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State Simulation */}
          {suppliers.length === 0 && (
            <div className="py-20 text-center">
              <Users className="w-12 h-12 text-emerald-100 mx-auto mb-3" />
              <p className="text-gray-400">Belum ada data supplier.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Supplier;