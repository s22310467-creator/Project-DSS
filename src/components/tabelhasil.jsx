/* eslint-disable no-unused-vars */
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

const TabelHasil = ({ title, headers, data = [], type = "default" }) => {
  return (
    <div className="glass-card overflow-hidden w-full bg-white/40 border border-white/60 shadow-sm rounded-2xl">
      <div className="p-5 border-b border-white/40 bg-white/20 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-emerald-500/5">
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-black uppercase text-emerald-900 border-b border-emerald-100">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {data.length > 0 ? data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/50 transition-colors">
                {Object.values(row).filter(val => typeof val !== 'object' || val === null).map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-6 py-4 text-sm text-gray-700">{cell}</td>
                ))}
              </tr>
            )) : (
              <tr><td colSpan={headers.length} className="px-6 py-10 text-center text-gray-400 italic">Belum ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TabelHasil;