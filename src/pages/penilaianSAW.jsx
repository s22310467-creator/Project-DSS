import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardCheck, Calculator, ArrowRight, Info, Database, Trash2, Save } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const PenilaianSAW = () => {
  const [nilai, setNilai] = useState({}); 
  const [kriteria, setKriteria] = useState([]);
  const [subKriteria, setSubKriteria] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const fetchData = (path, setter) => {
      onValue(ref(db, path), (snap) => {
        if (snap.exists()) {
          const rawData = snap.val();
          if (path === 'penilaian') {
            const restored = {};
            Object.keys(rawData).forEach(safeKey => {
              const originalKey = safeKey.replace(/_(\d+)/g, '.$1'); 
              restored[originalKey] = rawData[safeKey];
            });
            setNilai(restored);
            setIsCalculated(true);
          } else {
            const dataArray = Object.keys(rawData).map(key => ({
              firebaseID: key,
              ...rawData[key]
            }));
            setter(dataArray);
          }
        }
      });
    };

    fetchData('kriteria', setKriteria);
    fetchData('sub_kriteria', setSubKriteria);
    fetchData('suppliers', setSuppliers);
    fetchData('penilaian', setNilai); 
    
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const checkHasSub = (kriteriaFirebaseID) => {
    return subKriteria.some(sub => sub.parentId === kriteriaFirebaseID);
  };

  const getNilaiEfektif = (supplierKode, col) => {
    if (!col.isParent) return nilai[`${supplierKode}_${col.id}`] ?? "";

    const children = subKriteria.filter(s => s.parentId === col.firebaseID);
    
    if (children.length === 0) {
      return nilai[`${supplierKode}_${col.id}`] ?? "";
    } else {
      let total = 0;
      let count = 0;
      children.forEach(child => {
        const val = nilai[`${supplierKode}_${child.kode}`];
        if (val !== undefined && val !== "" && !isNaN(val)) {
          total += parseFloat(val);
          count++;
        }
      });
      return count > 0 ? (total / count).toFixed(2) : "";
    }
  };

  const listKolom = useMemo(() => {
    let cols = [];
    kriteria.forEach(k => {
      cols.push({ 
        id: k.kode, 
        nama: k.nama, 
        sifat: k.sifat, 
        isParent: true, 
        firebaseID: k.firebaseID,
        hasSub: checkHasSub(k.firebaseID)
      });
      const subs = subKriteria.filter(s => s.parentId === k.firebaseID);
      subs.forEach(sub => {
        cols.push({ id: sub.kode, nama: sub.nama, sifat: sub.sifat || k.sifat, isParent: false });
      });
    });
    return cols;
  }, [kriteria, subKriteria]);

  const matriksNormalisasi = useMemo(() => {
    const hasilR = {};
    if (!isCalculated || listKolom.length === 0 || suppliers.length === 0) return hasilR;

    listKolom.forEach((col) => {
      suppliers.forEach((s) => {
        const rawVal = getNilaiEfektif(s.kode, col);
        const v = parseFloat(rawVal);

        if (!isNaN(v) && v !== 0) {
          const sifat = (col.sifat || 'Benefit').toLowerCase();
          if (sifat === 'cost') {
            hasilR[`${s.kode}_${col.id}`] = 1 / v;
          } else {
            hasilR[`${s.kode}_${col.id}`] = v / 5;
          }
        } else {
            hasilR[`${s.kode}_${col.id}`] = 0;
        }
      });
    });
    return hasilR;
  }, [isCalculated, nilai, listKolom, suppliers]);

  const handleInputChange = (supplierKode, colId, value, isReadOnly) => {
    if (isReadOnly) return; 
    setIsCalculated(false);
    
    if (value === "") {
      setNilai(prev => {
        const newState = { ...prev };
        delete newState[`${supplierKode}_${colId}`];
        return newState;
      });
      return;
    }

    const val = parseFloat(value);
    if (val >= 1 && val <= 5) {
      setNilai(prev => ({ ...prev, [`${supplierKode}_${colId}`]: val }));
    }
  };

  const handleHitung = () => {
    if (Object.keys(nilai).length === 0) {
      alert("Silakan isi nilai penilaian terlebih dahulu!");
      return;
    }
    setIsCalculated(true);
  };

  const handleSave = async () => {
    try {
      const fullPenilaian = {};
      suppliers.forEach(s => {
        listKolom.forEach(col => {
          const val = getNilaiEfektif(s.kode, col);
          const safeKey = `${s.kode}_${col.id}`.replace(/\./g, '_');
          fullPenilaian[safeKey] = val === "" ? 0 : parseFloat(val);
        });
      });

      const cleanedNormalisasi = {};
      Object.keys(matriksNormalisasi).forEach(key => {
        const safeKey = key.replace(/\./g, '_');
        cleanedNormalisasi[safeKey] = matriksNormalisasi[key];
      });

      await set(ref(db, 'penilaian'), fullPenilaian);
      await set(ref(db, 'normalisasi'), cleanedNormalisasi);
      alert("✅ Penilaian & Normalisasi Berhasil Disimpan!");
    } catch (error) {
      alert("❌ Gagal: " + error.message);
    }
  };  

  const handleClearForm = () => {
    if (window.confirm("Kosongkan semua input?")) {
      setNilai({});
      setIsCalculated(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] text-emerald-600 font-bold animate-pulse">
      <Database className="mr-2" /> Menghubungkan ke Database...
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen font-sans">
      {/* Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-emerald-50">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl text-white shadow-lg shadow-emerald-200">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Penilaian SAW</h1>
            <p className="text-sm text-emerald-600 font-medium">Matriks Keputusan & Normalisasi</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleClearForm} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100 bg-white" title="Bersihkan Form">
            <Trash2 size={20} />
          </button>
          <button onClick={handleSave} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-emerald-600 text-emerald-600 px-5 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all active:scale-95">
            <Save size={19} /> Simpan
          </button>
          <button onClick={handleHitung} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-bold shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95">
            <Calculator size={19} /> Hitung
          </button>
        </div>
      </div>

      {/* Rujukan Skala Penilaian */}
      <div className="bg-white border border-emerald-100 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-tight">Rujukan Skala Penilaian (1-5)</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-hidden border border-gray-100 rounded-2xl">
            <table className="w-full text-[11px] text-center">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-3 border-b border-r">Skala</th>
                  <th className="p-3 border-b border-r text-emerald-700">Kriteria Benefit</th>
                  <th className="p-3 border-b text-rose-700">Kriteria Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {[
                  { s: 5, b: "Sangat Baik", c: "Sangat Murah" },
                  { s: 4, b: "Baik", c: "Murah" },
                  { s: 3, b: "Cukup", c: "Cukup" },
                  { s: 2, b: "Buruk", c: "Mahal" },
                  { s: 1, b: "Sangat Buruk", c: "Sangat Mahal" }
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 bg-gray-50/50 font-black border-r">{item.s}</td>
                    <td className="p-3 border-r text-gray-600">{item.b}</td>
                    <td className="p-3 text-gray-600">{item.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col justify-center space-y-3">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-[11px] text-emerald-900 font-bold uppercase tracking-wide">Ketentuan:</p>
                <ul className="text-[11px] text-emerald-800 space-y-1.5 leading-relaxed list-disc pl-4">
                  <li>Gunakan panah di dalam kotak input untuk menaikkan/menurunkan nilai.</li>
                  <li>Nilai Kriteria Utama yang memiliki Sub-Kriteria dihitung otomatis dari rata-rata.</li>
                  <li>Geser tabel ke kanan jika tampilan kolom terpotong.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matriks Keputusan (X) */}
      <div className="bg-white border border-emerald-100 rounded-[2rem] shadow-xl shadow-emerald-900/5 overflow-hidden">
        <div className="p-6 border-b border-emerald-50 bg-emerald-50/30 flex items-center justify-between">
          <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
            <Database size={16} /> Matriks Keputusan (X)
          </h2>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded-md uppercase">Geser Horizontal →</span>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-emerald-600">
                <th className="p-5 text-xs font-bold uppercase text-white border-b border-emerald-500/30 sticky left-0 bg-emerald-600 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                  Supplier
                </th>
                {listKolom.map((col) => (
                  <th key={col.id} className={`p-4 text-[10px] font-bold uppercase text-white text-center border-b border-l border-emerald-500/30 min-w-[160px] whitespace-nowrap ${col.isParent ? 'bg-emerald-700' : 'bg-emerald-600'}`}>
                    <div className="truncate max-w-[140px] mx-auto">{col.nama}</div>
                    <div className="mt-1 text-[8px] font-mono text-emerald-200/80 font-medium">
                      {col.id} • {col.sifat}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {suppliers.map((s) => (
                <tr key={s.kode} className="group hover:bg-emerald-50/40 transition-colors">
                  <td className="p-5 text-sm font-bold text-gray-700 border-r border-emerald-50/50 sticky left-0 z-10 bg-white group-hover:bg-emerald-50 transition-colors shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    {s.nama}
                  </td>
                  {listKolom.map((col) => {
                    const isReadOnly = col.isParent && col.hasSub;
                    const val = getNilaiEfektif(s.kode, col);
                    
                    return (
                      <td key={col.id} className={`p-3 text-center border-l border-emerald-50/50 ${col.isParent ? 'bg-emerald-50/20' : ''}`}>
                        <input 
                          type="number" 
                          min="1"
                          max="5"
                          step={isReadOnly ? "0.01" : "1"}
                          placeholder={isReadOnly ? "Auto" : "1-5"}
                          readOnly={isReadOnly}
                          className={`w-20 p-2.5 rounded-xl text-center font-bold font-mono outline-none transition-all shadow-sm ${
                            isReadOnly 
                              ? "bg-emerald-100/40 border-emerald-100 text-emerald-700 cursor-not-allowed text-xs appearance-none" 
                              : "bg-white border-gray-200 text-emerald-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 border hover:border-emerald-300"
                          }`}
                          value={val}
                          onChange={(e) => handleInputChange(s.kode, col.id, e.target.value, isReadOnly)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriks Normalisasi (R) */}
      {isCalculated && (
        <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center gap-4 px-2">
            <h2 className="text-lg font-black text-emerald-900 flex items-center gap-2">
              <ArrowRight className="text-emerald-500" size={22} strokeWidth={3} />
              Hasil Normalisasi (R)
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-100 to-transparent"></div>
          </div>
          <div className="bg-white border border-emerald-100 rounded-[2rem] shadow-2xl shadow-emerald-900/10 overflow-hidden">
            <div className="overflow-x-auto pb-4">
              <table className="w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest border-b border-emerald-600/50 sticky left-0 bg-emerald-800 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Supplier</th>
                    {listKolom.map((col) => (
                      <th key={col.id} className="px-4 py-5 text-[10px] font-bold uppercase text-center border-b border-l border-emerald-600/50 min-w-[100px]">{col.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {suppliers.map((sup) => (
                    <tr key={sup.kode} className="hover:bg-emerald-50/50 transition-colors group">
                      <td className="px-6 py-5 text-xs font-bold text-gray-700 border-r border-emerald-50/50 sticky left-0 bg-white group-hover:bg-emerald-50 transition-colors">{sup.nama}</td>
                      {listKolom.map((col) => {
                        const valR = matriksNormalisasi[`${sup.kode}_${col.id}`];
                        return (
                          <td key={col.id} className="px-4 py-5 text-center font-mono text-sm border-l border-emerald-50/50 text-emerald-600 font-black">
                            {valR ? valR.toFixed(2) : "0.00"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenilaianSAW;
