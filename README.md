# Pharmacy Supplier Decision Support System (DSS)
Sistem Pendukung Keputusan (SPK) berbasis web yang dirancang untuk membantu proses pemilihan supplier secara objektif dan transparan. Sistem ini mengintegrasikan metode **Analytic Hierarchy Process (AHP)** untuk pembobotan kriteria dan **Simple Additive Weighting (SAW)** untuk perankingan akhir.

## 🚀 Fitur Utama
- **Interactive Dashboard**: Visualisasi ringkasan data kriteria, sub-kriteria, dan supplier beserta chart performa TOP 3 Supplier menggunakan *Recharts*.
- **Management Supplier**: Pendataan lengkap vendor (Kode, Nama, Alamat, Email) dengan sistem kode otomatis.
- **Hierarchical Criteria**: Pengelolaan kriteria dan sub-kriteria yang fleksibel, mendukung tipe kriteria *Benefit* dan *Cost*.
- **Analisis AHP**: Penghitungan bobot prioritas kriteria melalui matriks perbandingan berpasangan (Pairwise Comparison).
- **Penilaian & Normalisasi SAW**: Input penilaian performa supplier yang otomatis ternormalisasi berdasarkan bobot kriteria.
- **Export Laporan PDF**: Generasi laporan hasil akhir perankingan secara otomatis menggunakan *jsPDF* dan *AutoTable*.
- **Branded UI**: Antarmuka modern dengan skema warna Emerald yang konsisten dengan identitas visual kesehatan.

## 🛠️ Stack Teknologi
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **PDF Engine**: jsPDF & jsPDF-AutoTable

## 📋 Alur Analisis (DSS Workflow)
Sistem ini bekerja dengan mengikuti standar logika SPK hibrida:

1. **Master Data**: Masukkan data supplier dan tentukan kriteria serta sub-kriteria penilaian.
2. **Weighting (AHP)**: Tentukan tingkat kepentingan antar kriteria untuk mendapatkan nilai bobot prioritas yang konsisten.
3. **Scoring (SAW)**: Masukkan nilai mentah setiap supplier pada masing-masing kriteria.
4. **Normalisasi**: Sistem akan menghitung matriks normalisasi (R) sesuai sifat kriteria (Benefit = Max, Cost = Min).
5. **Ranking**: Nilai normalisasi dikalikan dengan bobot AHP untuk menghasilkan skor akhir (V) dan menentukan peringkat.

## 🚦 Persyaratan Sistem
Pastikan perangkat Anda telah terinstal:
- [Node.js](https://nodejs.org/) (Versi 18 atau terbaru)
- [npm](https://www.npmjs.com/)

## 💻 Instalasi dan Penggunaan
1. **Clone Repositori**
   ```bash
   git clone [url-repositori-anda]
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase**
   Hubungkan proyek dengan Firebase Anda pada file `src/firebase.js`.

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Aplikasi akan dapat diakses melalui `http://localhost:5173`.

## 📁 Struktur Folder
```text
src/
├── pages/
│   ├── dashboard.jsx    # Visualisasi & Ringkasan Statistik
│   ├── supplier.jsx     # Manajemen Data Supplier
│   ├── kriteria.jsx     # Manajemen Kriteria & Sub-Kriteria
│   ├── analisisAHP.jsx  # Proses Perhitungan Bobot Kriteria
│   ├── penilaianSAW.jsx # Input Nilai & Normalisasi Matrix
│   └── laporan.jsx      # Rekapitulasi & Export PDF
├── firebase.js          # Inisialisasi Firebase Database
└── App.jsx              # Konfigurasi Routing
```

## 🛡️ Keamanan & Validasi
- **Real-time Sync**: Semua perubahan data langsung tersimpan dan terbarui di seluruh sesi melalui Firebase.
- **Auto-Logic**: Jika kriteria memiliki sub-kriteria, sistem secara otomatis menghitung nilai rata-rata sub-kriteria untuk mengisi nilai induknya.
- **Input Sanitization**: Memastikan format input nilai sesuai dengan skala penilaian yang ditentukan.

## 🛡️ Kebijakan Keamanan & Database
Sistem ini saat ini dikonfigurasi untuk keperluan **Demo Publik**. Mohon diperhatikan poin-poin berikut:

- **Akses Terbuka**: Karena kredensial Firebase bersifat publik dalam demo ini, aturan keamanan disetel ke `.read: true` dan `.write: true`.
- **Transparansi**: Hal ini dilakukan agar pengguna/penguji dapat langsung mencoba fitur **Tambah, Edit, dan Hapus** tanpa kendala autentikasi.
- **Risiko**: Siapa pun yang memiliki akses ke aplikasi dapat mengubah data secara real-time. Mohon untuk tidak memasukkan data sensitif.
- **Produksi**: Jika ingin digunakan secara serius, sangat disarankan untuk mengaktifkan *Firebase Authentication* dan mengubah *Security Rules* menjadi `.write: false` atau berbasis ID pengguna.

## 📄 Lisensi
Proyek ini dikembangkan untuk kebutuhan internal/akademik. Seluruh aset desain dan identitas merek adalah hak cipta dari pihak yang bersangkutan.
