/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FileText, Download, Trophy, Award, Medal, Database } from 'lucide-react';
import { db } from '../firebase';
import { ref, get, set } from 'firebase/database';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Laporan = () => {
  const [ranking, setRanking] = useState([]);
  const [allData, setAllData] = useState(null);
  const [listKolom, setListKolom] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        const snapshot = await get(ref(db));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAllData(data);

          if (data.penilaian && data.ahp_bobot && data.suppliers) {
            const n = data.penilaian || {};
            const b = data.ahp_bobot.prioritas || {};
            const sups = Object.values(data.suppliers || {});
            
            // 1. Susun List Kolom (Kriteria & Sub-Kriteria)
            const subKrits = Object.values(data.sub_kriteria || {}).map(s => ({ firebaseID: s.firebaseID, ...s }));
            
            let cols = [];
            Object.keys(data.kriteria || {}).forEach(key => {
              const k = data.kriteria[key];
              cols.push({ id: k.kode, nama: k.nama, sifat: k.sifat, isParent: true });
              
              const subs = subKrits.filter(s => s.parentId === key);
              subs.sort((a, b) => a.kode.localeCompare(b.kode)).forEach(sub => {
                cols.push({ id: sub.kode, nama: sub.nama, sifat: sub.sifat || k.sifat, isParent: false });
              });
            });
            setListKolom(cols);

            // 2. Cari Nilai MAX dan MIN (Langkah Normalisasi SAW)
            const maxMin = {};
            cols.forEach(col => {
              const safeColId = col.id.replace(/\./g, '_');
              const values = sups.map(s => parseFloat(n[`${s.kode}_${safeColId}`]) || 0);
              const validVals = values.filter(v => v > 0);
              
              maxMin[col.id] = {
                max: values.length > 0 ? Math.max(...values) : 1,
                min: validVals.length > 0 ? Math.min(...validVals) : 1
              };
            });

            // 3. Hitung Skor SAW dengan Bobot AHP
            const results = sups.map(s => {
              let totalSkor = 0;
              
              cols.forEach(col => {
                const safeColId = col.id.replace(/\./g, '_');
                const x = parseFloat(n[`${s.kode}_${safeColId}`]) || 0;
                const weight = parseFloat(b[safeColId]) || 0;
                
                let r = 0; 
                if (x > 0) {
                  const sifat = (col.sifat || 'Benefit').toLowerCase();
                  if (sifat === 'benefit') {
                    r = x / (maxMin[col.id].max || 1);
                  } else {
                    r = (maxMin[col.id].min || 1) / x;
                  }
                }
                totalSkor += (r * weight);
              });

              return { 
                kode: s.kode,
                nama: s.nama, 
                // PERUBAHAN: Bulatkan menjadi 2 angka di belakang koma
                skor: parseFloat(totalSkor.toFixed(2)) 
              };
            }).sort((a, b) => b.skor - a.skor);

            setRanking(results);
            // Simpan hasil perangkingan ke database
            await set(ref(db, 'hasil_akhir'), results);
          }
        }
      } catch (error) {
        console.error("Error calculating Final Score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, []);

const handleExportPDF = () => {
    try {
      if (!allData || listKolom.length === 0) {
        alert("Data belum lengkap.");
        return;
      }

      const doc = new jsPDF();
      const date = new Date().toLocaleDateString('id-ID');

      doc.setFontSize(16);
      doc.text("Laporan Lengkap Sistem Pendukung Keputusan", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Dicetak pada: ${date} | Metode: AHP & SAW`, 14, 26);

      let currentY = 38;

// 1. Tabel Kriteria
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("1. Data Kriteria & Sub-Kriteria", 14, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Kode', 'Nama Kategori', 'Level', 'Sifat']],
        body: listKolom.map(k => [
          k.id, 
          k.isParent ? k.nama : `   • ${k.nama}`, // PERBAIKAN: Beri indentasi visual seperti UI
          k.isParent ? 'Kriteria Utama' : 'Sub-Kriteria', 
          k.isParent ? k.sifat : '—' // PERBAIKAN: Sub-kriteria dicetak dengan tanda strip (—)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] }
      });
      currentY = doc.lastAutoTable.finalY + 10;
      
      // 2. Tabel Supplier
      doc.text("2. Data Supplier", 14, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Kode', 'Nama Supplier', 'Alamat']],
        body: Object.values(allData.suppliers || {}).map(s => [s.kode, s.nama, s.alamat || '-']),
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] }
      });
      currentY = doc.lastAutoTable.finalY + 10;

// 3. Tabel Matriks Perbandingan Berpasangan AHP (DIPERBAIKI)
doc.text("3. Matriks Perbandingan Berpasangan AHP", 14, currentY);
      
      const matrixData = allData.ahp_bobot?.matrix || {};
      
      // Ambil daftar kriteria unik LANGSUNG dari kunci yang ada di database ahp_bobot > matrix
      // Ini jauh lebih aman karena data pasti ada di database
      const matrixKeys = Array.from(new Set(
        Object.keys(matrixData).map(k => k.split('-')[0])
      )).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      if (matrixKeys.length === 0) {
        // Fallback jika database matrix kosong, ambil dari list kriteria utama
        listKolom.filter(k => k.isParent).forEach(k => matrixKeys.push(k.id));
      }

      autoTable(doc, {
        startY: currentY + 4,
        head: [['Krit', ...matrixKeys]], // Header kolom
        body: matrixKeys.map(rowKey => [
          rowKey, // Kolom pertama (Label Baris)
          ...matrixKeys.map(colKey => {
            const key = `${rowKey}-${colKey}`; // Menggunakan pemisah "-"
            const val = matrixData[key];
            
            if (val !== undefined) return parseFloat(val).toFixed(2);
            return rowKey === colKey ? "1.00" : "0.00";
          })
        ]),
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] },
        styles: { fontSize: 8, halign: 'center' },
        columnStyles: { 0: { halign: 'left', fontStyle: 'bold', fillColor: [240, 240, 240] } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      // 4. Tabel Bobot AHP
      doc.text("4. Bobot Prioritas AHP (Presisi Asli)", 14, currentY);
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Kode Kriteria', 'Bobot Prioritas']],
        body: Object.entries(allData.ahp_bobot?.prioritas || {}).map(([key, val]) => [key.replace(/_/g, '.'), val]),
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      // 5. Matriks Penilaian
      doc.text("5. Matriks Penilaian (Data Input User)", 14, currentY);
      const penhead = ['Supplier', ...listKolom.map(c => c.id)];
      const penbody = Object.values(allData.suppliers || {}).map(s => {
        const row = [s.nama];
        listKolom.forEach(col => {
          const safeColId = col.id.replace(/\./g, '_');
          const val = allData.penilaian[`${s.kode}_${safeColId}`];
          row.push(val !== undefined ? val : '0');
        });
        return row;
      });

      autoTable(doc, {
        startY: currentY + 5,
        head: [penhead],
        body: penbody,
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] },
        styles: { fontSize: 7, halign: 'center' },
        columnStyles: { 0: { halign: 'left', fontStyle: 'bold', fontSize: 8 } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

// 6. Tabel Normalisasi Penilaian Supplier (PERBAIKAN)
      doc.text("6. Matriks Normalisasi Penilaian (SAW)", 14, currentY);
      const normalisasiData = allData.normalisasi || {};
      
      const normBody = Object.values(allData.suppliers || {}).map(s => {
        const row = [s.nama];
        listKolom.forEach(col => {
          // Pastikan titik (.) diganti underscore (_) agar cocok dengan Firebase
          const safeColId = col.id.replace(/\./g, '_');
          const key = `${s.kode}_${safeColId}`;
          const val = normalisasiData[key];
          
          row.push(val !== undefined ? parseFloat(val).toFixed(3) : '0.000');
        });
        return row;
      });

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Supplier', ...listKolom.map(c => c.id)]],
        body: normBody,
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] },
        styles: { fontSize: 7, halign: 'center' },
        columnStyles: { 0: { halign: 'left', fontStyle: 'bold', fontSize: 8 } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      // 7. Hasil Akhir
      doc.setFontSize(12);
      doc.text("7. Laporan Hasil Akhir & Perangkingan", 14, currentY);
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Rank', 'Nama Supplier', 'Skor Akhir (Round 2)']],
        body: ranking.map((r, i) => [i + 1, r.nama, r.skor.toFixed(2)]),
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] },
        styles: { halign: 'center' },
        columnStyles: { 1: { halign: 'left', fontStyle: 'bold' }, 2: { fontStyle: 'bold', textColor: [5, 150, 105] } }
      });

      doc.save(`Laporan_SPK_Final_${date.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error("PDF Error: ", error);
      alert("Gagal mengekspor PDF.");
    }
  };
  
  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-200 text-emerald-700 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan Hasil Akhir</h1>
            <p className="text-sm text-gray-500">Perangkingan dengan skor akhir pembulatan 2 desimal.</p>
          </div>
        </div>
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition active:scale-95"
        >
          <Download size={18} /> Export PDF Lengkap
        </button>
      </div>

      <div className="bg-white border border-emerald-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest border-r border-emerald-500/30 w-24">Rank</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Nama Supplier</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center w-48">Skor Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {ranking.map((item, index) => (
                <tr key={item.kode} className={`transition-colors ${index === 0 ? 'bg-amber-500/5' : 'hover:bg-emerald-50/30'}`}>
                  <td className="px-8 py-5 border-r border-emerald-50/50">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-gray-400">#{index + 1}</span>
                      {index === 0 && <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />}
                      {index === 1 && <Medal className="w-6 h-6 text-slate-400" />}
                      {index === 2 && <Award className="w-6 h-6 text-orange-400" />}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-gray-700 uppercase text-sm tracking-tight">{item.nama}</td>
                  <td className="px-8 py-5 text-center font-mono font-black text-emerald-700 text-xl tracking-tighter">
                    {item.skor.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center py-6">
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          <Award className="w-4 h-4 text-emerald-500" />
          <span>Sistem Pendukung Keputusan • Final Report</span>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
