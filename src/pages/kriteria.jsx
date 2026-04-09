import React from 'react';
import { Settings2, Plus, Edit, Trash2 } from 'lucide-react';
import TabelHasil from '../components/tabelhasil';

const Kriteria = () => {
  // Data Header sesuai kebutuhan kriteria DSS
  const headers = ["No", "Kode", "Nama Kriteria", "Sifat (Cost/Benefit)", "Aksi"];

  // Data Dummy Kriteria
  const dataKriteria = [
    { no: 1, kode: "C1", nama: "Harga", sifat: "Cost" },
    { no: 2, kode: "C2", nama: "Kualitas", sifat: "Benefit" },
    { no: 3, kode: "C3", nama: "Waktu Pengiriman", sifat: "Cost" },
    { no: 4, kode: "C4", nama: "Pelayanan", sifat: "Benefit" },
    { no: 5, kode: "C5", nama: "Fleksibilitas", sifat: "Benefit" },
  ];

  // Fungsi untuk merender tombol aksi di dalam tabel
  const renderData = dataKriteria.map((item) => ({
    ...item,
    aksi: (
      <div className="flex gap-2">
        <button className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
          <Edit size={16} />
        </button>
        <button className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    )
  }));

  return (
    <div className="space-y-6 page-transition">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-100">
            <Settings2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Kriteria</h1>
            <p className="text-sm text-gray-500">Kelola kriteria penilaian untuk metode AHP & SAW</p>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95">
          <Plus size={18} />
          <span>Tambah Kriteria</span>
        </button>
      </div>

      {/* Tabel Kriteria */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl overflow-hidden">
        <TabelHasil 
          title="Daftar Kriteria Penilaian" 
          headers={headers} 
          data={renderData} 
        />
      </div>

      {/* Info Card */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
        <div className="w-1 h-auto bg-blue-400 rounded-full"></div>
        <p className="text-sm text-blue-700">
          <strong>Tips:</strong> Kriteria dengan sifat <strong>Benefit</strong> berarti semakin besar nilainya semakin baik. Sebaliknya, <strong>Cost</strong> berarti semakin kecil nilainya semakin baik.
        </p>
      </div>
    </div>
  );
};

export default Kriteria;