// pages/organisasi/pegawai.tsx
"use client";

import React from "react";
import { useRouter } from "next/router";
import PageTitle from "@/components/ui/PageTitle";
import CariPegawaiPage from "@/components/Organisasi/CariPegawai";

const PegawaiPage: React.FC = () => {
  const router = useRouter();

  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg text-primary font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";
  const menuItems = [
    { label: "Peta & Statistik", path: "/organisasi" },
    { label: "Struktur Organisasi", path: "/organisasi/struktur" },
    { label: "Cari Pegawai", path: "/organisasi/pegawai" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col">
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

      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-16 z-40 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 py-2">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`${menuButtonBaseStyle} ${
                    isActive
                      ? "bg-menu-bg-active text-menu-text-active font-semibold shadow" // <-- Gaya aktif
                      : "bg-menu-bg text-menu-text hover:bg-menu-bg-hover hover:text-menu-text-hover" // <-- Gaya tidak aktif
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-grow">
        <CariPegawaiPage />
      </main>
    </div>
  );
};

export default PegawaiPage;
