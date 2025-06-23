// pages/coba.tsx (atau idealnya pages/organisasi/pegawai.tsx jika ini adalah halaman Cari Pegawai)
"use client";

import React from "react";
import { useRouter } from "next/router"; // 👈 Impor useRouter

import PageTitle from "@/components/ui/PageTitle";
import CariPegawaiPage from "@/components/Organisasi/CariPegawai";
import AccessibilityMenu from "@/components/ui/AccessibilityMenu";

const CariPegawai: React.FC = () => {
  // 👈 Nama komponen bisa disesuaikan jika ini adalah halaman spesifik
  const router = useRouter();

  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg text-primary font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  // Daftar item menu, sama seperti di Organisasi.tsx
  const menuItems = [
    { label: "Peta & Statistik", path: "/organisasi" },
    { label: "Struktur Organisasi", path: "/organisasi/struktur" },
    { label: "Cari Pegawai", path: "/organisasi/pegawai" },
    // Jika halaman ini diakses via /coba, dan ingin "Cari Pegawai" aktif,
    // Anda mungkin perlu menyesuaikan path di sini atau logika isActive,
    // atau mengganti nama file/route menjadi /organisasi/pegawai.
    // Untuk contoh ini, saya asumsikan path akan cocok.
  ];

  return (
    <div className="bg-surface-page dark:bg-surface-page-dark min-h-screen flex flex-col">
      {/* Page Title Section - Mengikuti gaya dari Organisasi.tsx */}

      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title="Direktori Pegawai BPS"
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
        <div className="relative z-10"></div>
      </div>

      {/* Menu Organisasi Inlined (Navigasi Halaman) - Mengikuti gaya dari Organisasi.tsx */}
      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-16 z-40">
        {" "}
        {/* Sesuaikan top-16 jika tinggi Navbar Anda berbeda */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center py-3 sm:py-4">
            {menuItems.map((item) => {
              // Logika untuk menandai item menu yang aktif
              // Jika halaman ini adalah /organisasi/pegawai, maka item "Cari Pegawai" akan aktif.
              // Jika Anda mengakses halaman ini melalui /coba, maka tidak ada yang aktif kecuali path diubah.
              const isActive = router.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`${menuButtonBaseStyle} 
                    ${
                      isActive
                        ? "bg-[#adcbe3] dark:bg-[#8ab6d6] text-slate-900 dark:text-slate-100 font-semibold shadow-md ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-blue-500 dark:ring-sky-400"
                        : "bg-[#e0eaf4] dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-[#d0ddeb] dark:hover:bg-slate-600 shadow-sm"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Konten Utama Halaman */}
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
        {/* Menampilkan komponen CariPegawaiPage */}
        <CariPegawaiPage />
      </div>

      {/* AccessibilityMenu tetap ada */}
      <AccessibilityMenu />
    </div>
  );
};

export default CariPegawai; // 👈 Ganti nama default export jika nama komponen diubah (misal menjadi PegawaiPage)
