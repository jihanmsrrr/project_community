// components/Organisasi/StrukturOrganisasi.tsx (atau path yang sesuai)
// Saya asumsikan ini adalah komponen StrukturOrganisasi yang Anda impor di halaman OrganisasiPage.
"use client"; // Jika ada interaksi atau state, jika tidak, bisa dihapus jika ini murni tampilan

import React from "react";

// Data bisa juga dari props jika ingin lebih dinamis
const jabatanKepala = "Kepala BPS";
const jabatanBidang = [
  "Sekretariat Utama", // Contoh penyesuaian nama
  "Deputi Bidang Statistik Sosial",
  "Deputi Bidang Statistik Distribusi dan Jasa",
  "Deputi Bidang Neraca dan Analisis Statistik",
  "Deputi Bidang Metodologi dan Informasi Statistik",
  // Anda bisa tambahkan Inspektorat Utama jika perlu
];

const StrukturOrganisasi: React.FC = () => {
  return (
    // Kontainer utama dengan padding dan perataan
    // Menggunakan variabel tema untuk background halaman jika section ini berdiri sendiri
    // atau biarkan transparan jika sudah ada parent dengan bg-surface-page
    <div className="flex justify-center items-center p-5 sm:p-8 bg-surface-page rounded-xl shadow-md">
      <div className="flex flex-col items-center relative max-w-full w-auto sm:w-full">
        {" "}
        {/* max-w-4xl dihapus agar lebih fleksibel, w-auto untuk mobile */}
        {/* Kepala BPS */}
        <div
          className="relative bg-brand-primary text-text-on-brand font-semibold w-48 sm:w-56 py-3 px-4 rounded-lg text-center cursor-default shadow-md hover:bg-brand-primary-hover transition-colors duration-200 text-sm sm:text-base"
          title={jabatanKepala} // Tooltip untuk nama penuh jika terpotong
        >
          {jabatanKepala}
          {/* Garis bawah penghubung */}
          {jabatanBidang.length > 0 && ( // Hanya tampilkan jika ada bidang di bawahnya
            <span className="absolute bottom-[-20px] left-1/2 w-0.5 h-5 bg-text-secondary -translate-x-1/2" />
          )}
        </div>
        {/* Baris ke-2 (Bidang/Deputi) */}
        {jabatanBidang.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 mt-10 relative w-full pt-5">
            {" "}
            {/* pt-5 untuk ruang garis horizontal */}
            {/* Garis horizontal utama penghubung */}
            <span className="absolute top-0 left-[10%] right-[10%] md:left-[20%] md:right-[20%] h-0.5 bg-text-secondary" />
            {jabatanBidang.map((title, i) => (
              <div
                key={i}
                className="relative bg-brand-primary text-text-on-brand font-semibold w-48 sm:w-56 py-3 px-4 rounded-lg text-center cursor-default shadow-md hover:bg-brand-primary-hover transition-colors duration-200 text-sm sm:text-base"
                title={title}
              >
                {title}
                {/* Garis vertikal ke atas penghubung */}
                <span className="absolute top-[-20px] left-1/2 w-0.5 h-5 bg-text-secondary -translate-x-1/2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StrukturOrganisasi;
