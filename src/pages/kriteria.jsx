import React, { useState, useEffect } from 'react';
import { Settings2, Plus, Trash2, ChevronRight, X } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, push, remove } from 'firebase/database';

const Kriteria = () => {
  const [kriteria, setKriteria] = useState([]);
  const [subKriteria, setSubKriteria] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [formData, setFormData] = useState({ 
    kode: "", 
    nama: "", 
    sifat: "Benefit",
    parentId: "" 
  });

  useEffect(() => {
    onValue(ref(db, 'kriteria'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setKriteria(Object.keys(data).map(id => ({ id, ...data[id] })));
      } else setKriteria([]);
    });

    onValue(ref(db, 'sub_kriteria'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setSubKriteria(Object.keys(data).map(id => ({ id, ...data[id] })));
      } else setSubKriteria([]);
    });
  }, []);

  const openModal = (forSub = false) => {
    setIsSub(forSub);
    if (!forSub) {
      const nextIndex = kriteria.length + 1;
      setFormData({ kode: `C${nextIndex}`, nama: "", sifat: "Benefit", parentId: "" });
    } else {
      setFormData({ kode: "", nama: "", sifat: "Benefit", parentId: "" });
    }
    setShowModal(true);
  };

  const handleParentChange = (e) => {
    const pId = e.target.value;
    if (pId) {
      const parent = kriteria.find(k => k.id === pId);
      const siblings = subKriteria.filter(sk => sk.parentId === pId);
      const nextSubIndex = siblings.length + 1;
      setFormData(prev => ({ 
        ...prev, 
        parentId: pId, 
        kode: `${parent.kode}.${nextSubIndex}` 
      }));
    } else {
      setFormData(prev => ({ ...prev, parentId: "", kode: "" }));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const path = isSub ? 'sub_kriteria' : 'kriteria';
    push(ref(db, path), formData);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setIsSub(false);
    setFormData({ kode: "", nama: "", sifat: "Benefit", parentId: "" });
  };

  // Reusable Component untuk Label Sifat (Agar Kriteria & Sub Sama)
  const SifatBadge = ({ sifat }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      sifat === 'Cost' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
    }`}>
      {sifat}
    </span>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-200 text-white">
             <Settings2 className="w-6 h-6"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Data Kriteria & Sub</h1>
        </div>
        <button 
          onClick={() => openModal(false)} 
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all font-bold active:scale-95"
        >
          <Plus size={18}/> Tambah Data
        </button>
      </div>

      <div className="bg-white/50 border border-white backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-emerald-50/50 border-b border-emerald-100">
            <tr>
              <th className="p-4 text-xs font-black uppercase text-emerald-900">Kode</th>
              <th className="p-4 text-xs font-black uppercase text-emerald-900">Nama</th>
              <th className="p-4 text-xs font-black uppercase text-emerald-900 text-center">Sifat</th>
              <th className="p-4 text-xs font-black uppercase text-emerald-900 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {kriteria.map(k => (
              <React.Fragment key={k.id}>
                {/* Baris Kriteria Utama */}
                <tr className="bg-emerald-50/20 group">
                  <td className="p-4 font-mono font-bold text-emerald-800">{k.kode}</td>
                  <td className="p-4 font-bold text-gray-700">{k.nama}</td>
                  <td className="p-4 text-center">
                    <SifatBadge sifat={k.sifat} />
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => remove(ref(db, `kriteria/${k.id}`))} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                      title="Hapus Kriteria"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>

                {/* Baris Sub Kriteria */}
                {subKriteria.filter(sk => sk.parentId === k.id).map(sk => (
                  <tr key={sk.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-3 pl-10 font-mono text-xs text-emerald-600/70 italic">{sk.kode}</td>
                    <td className="p-3 pl-4 text-sm text-gray-600 flex items-center gap-2">
                      <ChevronRight size={14} className="text-emerald-400"/> {sk.nama}
                    </td>
                    <td className="p-3 text-center">
                      {/* Sifat Subkriteria sekarang SAMA persis dengan kriteria utama */}
                      <SifatBadge sifat={sk.sifat} />
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => remove(ref(db, `sub_kriteria/${sk.id}`))} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        title="Hapus Subkriteria"
                      >
                        {/* Ukuran dan warna icon SAMA persis (18px) */}
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal tetap sama dengan fungsi openModal/handleParentChange yang sudah diperbaiki */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative border border-emerald-50">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20}/>
            </button>
            <h2 className="text-lg font-black mb-5 text-gray-800">Tambah Data Baru</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button type="button" onClick={() => openModal(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${!isSub ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>Kriteria</button>
                <button type="button" onClick={() => openModal(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${isSub ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>Sub</button>
              </div>

              {isSub && (
                <select 
                  value={formData.parentId} 
                  onChange={handleParentChange} 
                  className="w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 bg-white text-sm" 
                  required
                >
                  <option value="">Pilih Kriteria Induk</option>
                  {kriteria.map(k => <option key={k.id} value={k.id}>{k.nama} ({k.kode})</option>)}
                </select>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">ID Otomatis</label>
                <input 
                  type="text" 
                  value={formData.kode} 
                  readOnly 
                  className="w-full bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-sm font-mono font-bold text-emerald-700 cursor-not-allowed" 
                />
              </div>

              <input type="text" placeholder="Nama Kriteria/Sub" value={formData.nama} onChange={(e)=>setFormData({...formData, nama: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 text-sm focus:bg-emerald-50/10" required />
              
              <select value={formData.sifat} onChange={(e)=>setFormData({...formData, sifat: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 bg-white text-sm">
                <option value="Benefit">Benefit</option>
                <option value="Cost">Cost</option>
              </select>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kriteria;