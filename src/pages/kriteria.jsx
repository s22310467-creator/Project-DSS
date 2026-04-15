import React, { useState } from 'react';
import { Settings2, Plus, Edit, Trash2 } from 'lucide-react';
import TabelHasil from '../components/tabelhasil';

const Kriteria = () => {
  const headers = ["No", "Kode", "Nama Kriteria", "Sifat (Cost/Benefit)", "Aksi"];

  const dataKriteria = [
    { no: 1, kode: "C1", nama: "Harga", sifat: "Cost" },
    { no: 2, kode: "C2", nama: "Kualitas", sifat: "Benefit" },
    { no: 3, kode: "C3", nama: "Ketersediaan", sifat: "Benefit" },
    { no: 4, kode: "C4", nama: "Pelayanan", sifat: "Benefit" },
  ];

  const [kriteria, setKriteria] = useState(dataKriteria);

  const [subKriteria, setSubKriteria] = useState([
    { id: 1, parentNo: 4, nama: "Ekspedisi", sifat: "Cost" },
    { id: 2, parentNo: 4, nama: "Sistem Pembayaran", sifat: "Benefit" },
    { id: 3, parentNo: 4, nama: "Tempo Pembayaran", sifat: "Benefit" },

    { id: 4, parentNo: 2, nama: "Kondisi Saat Tiba", sifat: "Benefit" },
    { id: 5, parentNo: 2, nama: "Tanggal Kadaluarsa", sifat: "Benefit" },
    { id: 6, parentNo: 2, nama: "Garansi", sifat: "Benefit" },
    { id: 7, parentNo: 2, nama: "Kemasan", sifat: "Benefit" },
    { id: 8, parentNo: 2, nama: "Petunjuk Kegunaan", sifat: "Benefit" },
    { id: 9, parentNo: 2, nama: "Ketepatan Jumlah", sifat: "Benefit" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedNo, setSelectedNo] = useState(null);

  const [isSub, setIsSub] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState(null);

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    sifat: "Benefit",
    parentNo: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = () => {
    setIsEdit(false);
    setIsSub(false);
    setFormData({ kode: "", nama: "", sifat: "Benefit", parentNo: "" });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setIsSub(false);
    setSelectedNo(item.no);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (no) => {
    setKriteria(kriteria.filter((k) => k.no !== no));
    setSubKriteria(subKriteria.filter((s) => s.parentNo !== no)); 
  };

  const handleAddSub = (parentNo) => {
    setIsSub(true);
    setIsEdit(false);
    setFormData({ nama: "", sifat: "Benefit", parentNo });
    setShowModal(true);
  };

  const handleEditSub = (sub) => {
    setIsSub(true);
    setIsEdit(true);
    setSelectedSubId(sub.id);
    setFormData(sub);
    setShowModal(true);
  };

  const handleDeleteSub = (id) => {
    setSubKriteria(subKriteria.filter((s) => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSub) {
      if (isEdit) {
        const updated = subKriteria.map((s) =>
          s.id === selectedSubId ? { ...s, ...formData } : s
        );
        setSubKriteria(updated);
      } else {
        const newSub = {
          id: subKriteria.length + 1,
          ...formData
        };
        setSubKriteria([...subKriteria, newSub]);
      }
    } else {
      if (isEdit) {
        const updated = kriteria.map((k) =>
          k.no === selectedNo ? { ...k, ...formData } : k
        );
        setKriteria(updated);
      } else {
        const newData = {
          no: Math.max(...kriteria.map(k => k.no)) + 1, 
          ...formData
        };
        setKriteria([...kriteria, newData]);
      }
    }

    setShowModal(false);
  };

  const renderData = kriteria.flatMap((item) => {
    const subs = subKriteria.filter(s => s.parentNo === item.no);

    const parentRow = {
      ...item,
      aksi: (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(item)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(item.no)} className="p-1.5 bg-red-100 text-red-600 rounded-lg">
            <Trash2 size={16} />
          </button>
          <button onClick={() => handleAddSub(item.no)} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <Plus size={16} />
          </button>
        </div>
      )
    };

    const subRows = subs.map((sub, i) => ({
      no: `${item.kode}.${i + 1}`,
      kode: "-",
      nama: `↳ ${sub.nama}`,
      sifat: sub.sifat,
      aksi: (
        <div className="flex gap-2">
          <button onClick={() => handleEditSub(sub)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDeleteSub(sub.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }));

    return [parentRow, ...subRows];
  });

  return (
    <div className="space-y-6 page-transition">

      {/* HEADER */}
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

        <button onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl">
          <Plus size={18} /> Tambah Kriteria
        </button>
      </div>

      {/* TABEL */}
      <div className="bg-white/50 rounded-2xl shadow-xl overflow-hidden">
        <TabelHasil 
          title="Daftar Kriteria Penilaian"
          headers={headers}
          data={renderData}
        />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <form onSubmit={handleSubmit} className="space-y-3">

              {!isSub && (
                <>
                  <input
                    name="kode"
                    value={formData.kode}
                    onChange={handleChange}
                    placeholder="Kode Kriteria"
                    className="w-full border p-2 rounded-lg"
                  />

                  <input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Nama Kriteria"
                    className="w-full border p-2 rounded-lg"
                  />

                  <select
                    name="sifat"
                    value={formData.sifat}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="Benefit">Benefit</option>
                    <option value="Cost">Cost</option>
                  </select>
                </>
              )}

              {isSub && (
                <>
                  <select name="parentNo" value={formData.parentNo} onChange={handleChange}>
                    {kriteria.map(k => (
                      <option key={k.no} value={k.no}>{k.nama}</option>
                    ))}
                  </select>

                  <input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Nama Sub"
                  />

                  <select name="sifat" value={formData.sifat} onChange={handleChange}>
                    <option value="Benefit">Benefit</option>
                    <option value="Cost">Cost</option>
                  </select>
                </>
              )}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg">
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kriteria;