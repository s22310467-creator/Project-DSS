import React, { useState, useEffect } from 'react';
import { Settings2, Plus, Trash2, ChevronRight, X, Edit3 } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, push, remove, set } from 'firebase/database';

const Kriteria = () => {
  const [kriteria, setKriteria] = useState([]);
  const [subKriteria, setSubKriteria] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
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
    setIsEdit(false);
    setSelectedId(null);
    if (!forSub) {
      const nextIndex = kriteria.length + 1;
      setFormData({ kode: `C${nextIndex}`, nama: "", sifat: "Benefit", parentId: "" });
    } else {
      setFormData({ kode: "", nama: "", sifat: "Benefit", parentId: "" });
    }
    setShowModal(true);
  };

  const handleOpenEditModal = (data, forSub = false) => {
    setIsEdit(true);
    setIsSub(forSub);
    setSelectedId(data.id);
    setFormData({
      kode: data.kode,
      nama: data.nama,
      sifat: data.sifat || "Benefit",
      parentId: data.parentId || ""
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const path = isSub ? `sub_kriteria` : `kriteria`;
    const dataToSend = isSub 
      ? { kode: formData.kode, nama: formData.nama, parentId: formData.parentId }
      : { kode: formData.kode, nama: formData.nama, sifat: formData.sifat };

    if (isEdit) {
      set(ref(db, `${path}/${selectedId}`), dataToSend);
    } else {
      push(ref(db, path), dataToSend);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setIsSub(false);
    setIsEdit(false);
    setFormData({ kode: "", nama: "", sifat: "Benefit", parentId: "" });
  };

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
              <th className="p-4 text-xs font-black uppercase text-emerald-900 text-right pr-10">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {kriteria.map(k => (
              <React.Fragment key={k.id}>
                <tr className="bg-emerald-50/20 group">
                  <td className="p-4 font-mono font-bold text-emerald-800">{k.kode}</td>
                  <td className="p-4 font-bold text-gray-700">{k.nama}</td>
                  <td className="p-4 text-center">
                    <SifatBadge sifat={k.sifat} />
                  </td>
                  <td className="p-4 text-right flex justify-end gap-3 pr-6">
                    <button 
                      onClick={() => handleOpenEditModal(k, false)} 
                      className="text-blue-600 hover:scale-110 transition"
                      title="Edit Kriteria"
                    >
                      <Edit3 size={18}/>
                    </button>
                    <button 
                      onClick={() => remove(ref(db, `kriteria/${k.id}`))} 
                      className="text-red-600 hover:scale-110 transition"
                      title="Hapus Kriteria"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>

                {subKriteria.filter(sk => sk.parentId === k.id).map(sk => (
                  <tr key={sk.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-3 pl-10 font-mono text-xs text-emerald-600/70 italic">{sk.kode}</td>
                    <td className="p-3 pl-4 text-sm text-gray-600 flex items-center gap-2">
                      <ChevronRight size={14} className="text-emerald-400"/> {sk.nama}
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-gray-300 text-[10px]">—</span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3 pr-6">
                      <button 
                        onClick={() => handleOpenEditModal(sk, true)} 
                        className="text-blue-600 hover:scale-110 transition"
                        title="Edit Subkriteria"
                      >
                        <Edit3 size={16}/>
                      </button>
                      <button 
                        onClick={() => remove(ref(db, `sub_kriteria/${sk.id}`))} 
                        className="text-red-600 hover:scale-110 transition"
                        title="Hapus Subkriteria"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative border border-emerald-50">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20}/>
            </button>
            <h2 className="text-lg font-black mb-5 text-gray-800">
              {isEdit ? "Edit Data" : "Tambah Data Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isEdit && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider text-emerald-600">Tipe Data</label>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button type="button" onClick={() => openModal(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${!isSub ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>Kriteria</button>
                    <button type="button" onClick={() => openModal(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${isSub ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>Sub</button>
                  </div>
                </div>
              )}

              {isSub && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Kriteria Induk</label>
                  <select 
                    value={formData.parentId} 
                    onChange={handleParentChange} 
                    className={`w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 bg-white text-sm ${isEdit ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    disabled={isEdit}
                    required
                  >
                    <option value="">Pilih Kriteria Induk</option>
                    {kriteria.map(k => <option key={k.id} value={k.id}>{k.nama} ({k.kode})</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">ID / Kode</label>
                <input 
                  type="text" 
                  value={formData.kode} 
                  readOnly 
                  className="w-full bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-sm font-mono font-bold text-emerald-700 cursor-not-allowed" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Nama {isSub ? 'Sub-Kriteria' : 'Kriteria'}</label>
                <input 
                  type="text" 
                  placeholder="Masukkan nama..." 
                  value={formData.nama} 
                  onChange={(e)=>setFormData({...formData, nama: e.target.value})} 
                  className="w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 text-sm focus:bg-emerald-50/10" 
                  required 
                />
              </div>
              
              {!isSub && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Sifat Kriteria</label>
                  <select 
                    value={formData.sifat} 
                    onChange={(e)=>setFormData({...formData, sifat: e.target.value})} 
                    className="w-full border border-gray-200 p-3 rounded-xl outline-emerald-500 bg-white text-sm"
                  >
                    <option value="Benefit">Benefit</option>
                    <option value="Cost">Cost</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95">
                  {isEdit ? "Update" : "Simpan"}
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
