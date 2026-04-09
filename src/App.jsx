import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Komponen
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";

// Import Halaman
import Dashboard from "./pages/dashboard";
import Kriteria from "./pages/kriteria";
import Supplier from "./pages/supplier";
import AnalisisAHP from "./pages/analisisAHP";
import PenilaianSAW from "./pages/penilaianSAW";
import Laporan from "./pages/laporan";

function App() {
  return (
    <div className="flex min-h-screen bg-[#f0f9f4]">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <Navbar />
        
        {/* Konten Utama */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kriteria" element={<Kriteria />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/analisis-ahp" element={<AnalisisAHP />} />
            <Route path="/penilaian" element={<PenilaianSAW />} />
            <Route path="/laporan" element={<Laporan />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;