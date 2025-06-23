// pages/organisasi/struktur.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2Icon, // Pastikan ini diimpor dari lucide-react jika itu yang Anda gunakan
  ArrowLeftCircleIcon,
  ChevronRightIcon,
} from "lucide-react";

import PageTitle from "@/components/ui/PageTitle";
import DetailSatkerView from "@/components/Organisasi/DetailSatkerView";

// LANGKAH 3: Ganti sumber impor dataStatistikLengkap
import {
  processedDataStatistikLengkap as dataStatistikLengkap, // Menggunakan alias agar sisa kode tidak banyak berubah
} from "@/data/dummyPegawaiService";
// Tipe DataStatistikNasional masih bisa diimpor dari sumber aslinya jika tidak diekspor ulang oleh dummyPegawaiService
import { DataStatistikNasional } from "@/data/statistikProvinsi";
import type { DetailPegawaiData } from "@/types/pegawai";

type WilayahKey = Extract<keyof DataStatistikNasional, string>;

const SatkerCard: React.FC<{
  satker: DetailPegawaiData;
  onClick: () => void;
}> = ({ satker, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={onClick}
      className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out group border border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
            {satker.nama}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {satker.namaSatkerLengkap}
          </p>
        </div>
        <ChevronRightIcon className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-500 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
      {typeof satker.totalPegawai === "number" && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          Total Pegawai: {satker.totalPegawai.toLocaleString()}
        </p>
      )}
    </motion.div>
  );
};

const StrukturOrganisasiPage: React.FC = () => {
  const router = useRouter();
  const { wilayah: wilayahDariQuery } = router.query;

  const [searchQuerySatker, setSearchQuerySatker] = useState("");
  const [selectedWilayahUntukStruktur, setSelectedWilayahUntukStruktur] =
    useState<WilayahKey | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (router.isReady && isMounted) {
      const validWilayahKey = wilayahDariQuery as WilayahKey;
      // Menggunakan dataStatistikLengkap (yang sekarang adalah processedDataStatistikLengkap)
      if (validWilayahKey && dataStatistikLengkap[validWilayahKey]) {
        setSelectedWilayahUntukStruktur(validWilayahKey);
      } else {
        setSelectedWilayahUntukStruktur(null);
      }
    }
  }, [router.isReady, wilayahDariQuery, isMounted]);

  const semuaSatkerArray = useMemo(() => {
    // Menggunakan dataStatistikLengkap (yang sekarang adalah processedDataStatistikLengkap)
    return Object.keys(dataStatistikLengkap)
      .map((key) => dataStatistikLengkap[key as WilayahKey])
      .sort((a, b) => {
        if (a.id === "NASIONAL") return -1;
        if (b.id === "NASIONAL") return 1;
        return (a.nama || "").localeCompare(b.nama || "");
      });
  }, []); // Dependency array tetap kosong jika dataStatistikLengkap (processed) dianggap stabil setelah load awal

  const filteredSatkerList = useMemo(() => {
    if (!searchQuerySatker.trim()) {
      return semuaSatkerArray;
    }
    const queryLower = searchQuerySatker.toLowerCase();
    return semuaSatkerArray.filter(
      (satker) =>
        satker.nama?.toLowerCase().includes(queryLower) ||
        satker.namaSatkerLengkap?.toLowerCase().includes(queryLower) ||
        satker.namaWilayahAsli?.toLowerCase().includes(queryLower)
    );
  }, [searchQuerySatker, semuaSatkerArray]);

  const handleSelectSatker = (wilayahKode: WilayahKey) => {
    router.push(
      {
        pathname: router.pathname,
        query: { wilayah: wilayahKode },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleKembaliKeDaftar = () => {
    router.push(
      {
        pathname: router.pathname,
        query: {},
      },
      undefined,
      { shallow: true }
    );
  };

  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg text-primary font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";
  const menuItems = [
    { label: "Peta & Statistik", path: "/organisasi" },
    { label: "Struktur Organisasi", path: "/organisasi/struktur" },
    { label: "Cari Pegawai", path: "/organisasi/pegawai" },
  ];

  if (!isMounted || !router.isReady) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page dark:bg-surface-page-dark">
        <div className="text-text-primary dark:text-text-primary-dark">
          Memuat halaman...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title="Struktur Organisasi BPS"
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
        <div className="relative z-10"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center py-3 sm:py-4">
            {menuItems.map((item) => {
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

      <main className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
        <AnimatePresence mode="wait">
          {selectedWilayahUntukStruktur ? (
            <motion.div
              key="detail-satker-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <button
                onClick={handleKembaliKeDaftar}
                className="mb-6 inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors group"
              >
                <ArrowLeftCircleIcon className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
                Kembali ke Daftar Satuan Kerja
              </button>
              <DetailSatkerView wilayahKode={selectedWilayahUntukStruktur} />
            </motion.div>
          ) : (
            <motion.div
              key="daftar-satker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Pilih Satuan Kerja
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Cari atau pilih satuan kerja di bawah ini untuk melihat detail
                  struktur organisasinya.
                </p>
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuerySatker}
                    onChange={(e) => setSearchQuerySatker(e.target.value)}
                    placeholder="Ketik nama satuan kerja..."
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                               text-slate-700 dark:text-slate-200 text-base rounded-lg 
                               p-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500 focus:border-transparent"
                  />
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {filteredSatkerList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredSatkerList.map((satker) => (
                    <SatkerCard
                      key={satker.id}
                      satker={satker}
                      onClick={() =>
                        handleSelectSatker(satker.id as WilayahKey)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow">
                  <Building2Icon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />{" "}
                  {/* Pastikan Building2Icon diimpor */}
                  <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
                    Satuan Kerja tidak ditemukan.
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    Coba kata kunci lain.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StrukturOrganisasiPage;
