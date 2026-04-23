import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit3, X } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ kode: "", nama: "", alamat: "", email: "" });

  useEffect(() => {
    onValue(ref(db, 'suppliers'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setSuppliers(Object.keys(data).map(id => ({ id, ...data[id] })));
      } else setSuppliers([]);
    });
  }, []);

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setSelectedId(null);
    const nextIndex = suppliers.length + 1;
    const autoCode = `sp${nextIndex}`;
    setFormData({ kode: autoCode, nama: "", alamat: "", email: "" });
    setShowModal(true);
  };

  const handleOpenEditModal = (s) => {
    setIsEdit(true);
    setSelectedId(s.id);
    setFormData(s);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) set(ref(db, `suppliers/${selectedId}`), formData);
    else push(ref(db, 'suppliers'), formData);
    
    setShowModal(false);
    setFormData({ kode: "", nama: "", alamat: "", email: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users/> Data Supplier</h1>
        <button 
          onClick={handleOpenAddModal} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition"
        >
          <Plus size={18}/> Tambah
        </button>
      </div>

      <div className="bg-white/50 border border-white backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-emerald-50/50">
            <tr>
              <th className="p-4">Kode</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Alamat</th>
              <th className="p-4 text-right pr-10">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-t border-white/60">
                <td className="p-4 font-bold text-emerald-800">{s.kode}</td>
                <td className="p-4">{s.nama}</td>
                <td className="p-4 text-gray-500">{s.alamat}</td>
                <td className="p-4 flex justify-end gap-3 pr-6">
                  <button 
                    onClick={() => handleOpenEditModal(s)} 
                    className="text-blue-600 hover:scale-110 transition"
                  >
                    <Edit3 size={18}/>
                  </button>
                  <button 
                    onClick={() => remove(ref(db, `suppliers/${s.id}`))} 
                    className="text-red-600 hover:scale-110 transition"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
               onClick={() => setShowModal(false)} 
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20}/>
            </button>
            <h2 className="text-lg font-bold mb-4">{isEdit ? "Edit Supplier" : "Tambah Supplier"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Kode Supplier dengan Label */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Kode Supplier</label>
                <input 
                  type="text" 
                  placeholder="Kode" 
                  value={formData.kode} 
                  onChange={(e)=>setFormData({...formData, kode: e.target.value})} 
                  className={`w-full border p-3 rounded-xl outline-emerald-500 ${!isEdit ? 'bg-gray-50 text-emerald-700 font-bold cursor-not-allowed' : ''}`} 
                  readOnly={!isEdit}
                  required 
                />
              </div>

              {/* Input Nama Supplier dengan Label */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Nama Supplier</label>
                <input 
                  type="text" 
                  placeholder="Masukkan nama supplier..." 
                  value={formData.nama} 
                  onChange={(e)=>setFormData({...formData, nama: e.target.value})} 
                  className="w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 text-sm focus:bg-emerald-50/10" 
                  required 
                />
              </div>

              {/* Input Alamat Supplier dengan Label */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Alamat Supplier</label>
                <input 
                  type="text" 
                  placeholder="Masukkan alamat..." 
                  value={formData.alamat} 
                  onChange={(e)=>setFormData({...formData, alamat: e.target.value})} 
                  className="w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 text-sm focus:bg-emerald-50/10" 
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition"
                >
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

export default Supplier;
