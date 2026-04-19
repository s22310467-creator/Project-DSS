import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Scale, Info, Save, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const AnalisisAHP = () => {
  const [kriteria, setKriteria] = useState([]);
  const [subKriteria, setSubKriteria] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [bobot, setBobot] = useState({});
  const [loading, setLoading] = useState(true);

  const flatElements = useMemo(() => {
    const list = [];
    kriteria.forEach(k => {
      list.push({ ...k, type: 'parent' });
      const anak = subKriteria.filter(s => s.parentId === k.firebaseID);
      anak.forEach(a => list.push({ ...a, type: 'child' }));
    });
    return list;
  }, [kriteria, subKriteria]);

  const calculateAHP = useCallback((currentMatrix, list) => {
    const n = list.length;
    if (n === 0) return;

    const rowTotals = {};
    let grandTotal = 0;

    list.forEach(row => {
      let currentRowSum = 0;
      list.forEach(col => {
        const val = row.kode === col.kode ? 1 : (parseFloat(currentMatrix[`${row.kode}-${col.kode}`]) || 0);
        currentRowSum += val;
      });
      rowTotals[row.kode] = currentRowSum;
      grandTotal += currentRowSum;
    });

    const newBobot = {};
    list.forEach(row => {
      const eigenvector = grandTotal > 0 ? (rowTotals[row.kode] / grandTotal) : 0;
      newBobot[row.kode] = eigenvector.toFixed(2);
    });

    setBobot(newBobot);
  }, []);

  useEffect(() => {
    onValue(ref(db, 'kriteria'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setKriteria(Object.keys(data).map(key => ({ ...data[key], firebaseID: key })));
      }
    });

    onValue(ref(db, 'sub_kriteria'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setSubKriteria(Object.keys(data).map(key => ({ ...data[key], firebaseID: key })));
      }
    });

    onValue(ref(db, 'ahp_bobot'), (snap) => {
      if (snap.exists()) {
        const saved = snap.val();
        const restoredMatrix = {};
        if (saved.matrix) {
          Object.keys(saved.matrix).forEach(safeKey => {
            const originalKey = safeKey.replace(/_/g, '.');
            restoredMatrix[originalKey] = saved.matrix[safeKey];
          });
        }
        const restoredBobot = {};
        if (saved.prioritas) {
          Object.keys(saved.prioritas).forEach(safeKey => {
            const originalKey = safeKey.replace(/_/g, '.');
            restoredBobot[originalKey] = saved.prioritas[safeKey];
          });
        }
        setMatrix(restoredMatrix);
        setBobot(restoredBobot);
      }
      setLoading(false);
    });
  }, []);

  const handleMatrixChange = (row, col, value) => {
    if (value !== "" && parseFloat(value) < 0) return;
    setMatrix((prev) => {
      const updated = { ...prev, [`${row}-${col}`]: value };
      const num = parseFloat(value);
      if (!isNaN(num) && num > 0) {
        const reciprocal = Math.ceil((1 / num) * 100) / 100;
        updated[`${col}-${row}`] = reciprocal;
      } else {
        updated[`${col}-${row}`] = "";
      }
      calculateAHP(updated, flatElements);
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      if (Object.keys(bobot).length === 0) {
        alert("Data bobot belum dihitung.");
        return;
      }
      const cleanedMatrix = {};
      flatElements.forEach(row => {
        flatElements.forEach(col => {
          const originalKey = `${row.kode}-${col.kode}`;
          const safeKey = originalKey.replace(/\./g, '_'); 
          if (row.kode === col.kode) {
            cleanedMatrix[safeKey] = 1;
          } else {
            cleanedMatrix[safeKey] = parseFloat(matrix[originalKey]) || 0;
          }
        });
      });
      const cleanedBobot = {};
      Object.keys(bobot).forEach(kode => {
        const safeKode = kode.replace(/\./g, '_');
        cleanedBobot[safeKode] = bobot[kode];
      });
      const dbRef = ref(db, 'ahp_bobot');
      await set(dbRef, {
        matrix: cleanedMatrix,
        prioritas: cleanedBobot,
        updatedAt: new Date().toISOString()
      });
      alert("✅ Analisis AHP Berhasil Disimpan!");
    } catch (error) {
      alert(`❌ Gagal menyimpan: ${error.message}`);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-emerald-600 italic">Sinkronisasi Matriks...</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase">Analisis Matriks AHP</h1>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest italic">Metode: Total Baris / Grand Total • Round 2 Desimal</p>
          </div>
        </div>
        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
          <Save size={18} /> Simpan Analisis
        </button>
      </div>

      {/* Skala Perbandingan (Saaty) - TAMBAHAN TERBARU */}
      <div className="bg-white border border-emerald-100 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-tight">Skala Dasar Perbandingan (Saaty)</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-hidden border border-gray-100 rounded-2xl">
            <table className="w-full text-[11px]">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-3 text-center border-b border-r w-20">Intensitas</th>
                  <th className="p-3 text-left border-b">Definisi Kepentingan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                <tr>
                  <td className="p-3 text-center bg-emerald-50 text-emerald-700 font-black border-r">1</td>
                  <td className="p-3 text-gray-600">Kedua elemen sama pentingnya</td>
                </tr>
                <tr>
                  <td className="p-3 text-center bg-emerald-50 text-emerald-700 font-black border-r">3</td>
                  <td className="p-3 text-gray-600">Elemen yang satu sedikit lebih penting</td>
                </tr>
                <tr>
                  <td className="p-3 text-center bg-emerald-50 text-emerald-700 font-black border-r">5</td>
                  <td className="p-3 text-gray-600">Elemen yang satu lebih penting</td>
                </tr>
                <tr>
                  <td className="p-3 text-center bg-emerald-50 text-emerald-700 font-black border-r">7</td>
                  <td className="p-3 text-gray-600">Satu elemen jelas lebih mutlak penting</td>
                </tr>
                <tr>
                  <td className="p-3 text-center bg-emerald-50 text-emerald-700 font-black border-r">9</td>
                  <td className="p-3 text-gray-600">Satu elemen mutlak sangat penting</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-3 flex flex-col justify-center">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 border-dashed">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-600 mt-1" />
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  <b>Catatan:</b> Nilai <b>2, 4, 6, 8</b> adalah nilai antara di antara dua pertimbangan yang berdekatan. Jika elemen <b>A</b> memiliki nilai <b>3</b> terhadap <b>B</b>, maka secara otomatis elemen <b>B</b> memiliki nilai <b>1/3 (0.33)</b> terhadap <b>A</b>.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">INPUT</span>
                  <ChevronRight size={12} className="text-gray-300" />
                  <span className="text-[10px] font-black text-gray-700 uppercase italic">Baris vs Kolom</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Matriks */}
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4 text-left sticky left-0 bg-emerald-600 z-10 border-r border-emerald-500/30 min-w-[150px]">Elemen</th>
                {flatElements.map(el => (
                  <th key={el.kode} className="p-4 border-l border-emerald-500/30 text-center">{el.kode}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {flatElements.map((row, idxRow) => (
                <tr key={row.kode} className="group hover:bg-emerald-50/30 transition-colors">
                  <td className={`p-4 text-xs font-bold border-r border-gray-100 sticky left-0 z-10 
                    ${row.type === 'parent' ? 'bg-gray-50 text-emerald-900' : 'bg-white text-gray-400 pl-8'}`}>
                    {row.kode}
                  </td>
                  {flatElements.map((col, idxCol) => {
                    const isDiagonal = row.kode === col.kode;
                    const isLower = idxRow > idxCol;
                    const cellValue = isDiagonal ? "1" : (matrix[`${row.kode}-${col.kode}`] || "");

                    return (
                      <td key={col.kode} className="p-3 border-l border-gray-50 text-center">
                        <input 
                          type="number" step="0.01"
                          disabled={isDiagonal || isLower}
                          value={cellValue}
                          onChange={(e) => handleMatrixChange(row.kode, col.kode, e.target.value)}
                          className={`w-16 p-2 text-center text-xs font-mono rounded-lg border outline-none transition-all
                            ${isDiagonal ? 'bg-transparent border-transparent text-gray-400' : 
                              isLower ? 'bg-emerald-50 text-emerald-700 font-bold border-transparent' : 
                              'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'}`}
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

      {/* Hasil Bobot Prioritas */}
      <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Hasil Eigenvector (Tersimpan di Database)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {flatElements.map(el => (
            <div key={el.kode} className="p-5 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex justify-between items-center transition-all hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{el.kode}</p>
                <p className="text-sm font-bold text-gray-700 truncate w-24">{el.nama}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-black text-emerald-600">
                  {bobot[el.kode] || "0.00"}
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Weight Result</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4 items-center">
          <Info className="text-emerald-600 w-5 h-5 shrink-0" />
          <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
            Setiap kali Anda menekan <b>Simpan Analisis</b>, sistem akan memperbarui referensi <code>ahp_bobot</code> di Firebase, yang kemudian digunakan oleh sistem SAW untuk perangkingan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalisisAHP;