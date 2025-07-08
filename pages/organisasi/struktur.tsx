// pages/organisasi/struktur.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2Icon,
  ArrowLeftCircleIcon,
  ChevronRightIcon,
} from "lucide-react"; // Building2Icon is from lucide-react

import PageTitle from "@/components/ui/PageTitle";
import DetailSatkerView from "@/components/Organisasi/DetailSatkerView";

// Hapus impor dari dummyPegawaiService karena kita akan fetch dari API
// import { processedDataStatistikLengkap as dataStatistikLengkap, } from "@/data/dummyPegawaiService";

// Impor tipe AggregatedUnitData dan DashboardDataApi dari types/pegawai.ts
import type { DashboardDataApi, AggregatedUnitData } from "@/types/pegawai";

// Tidak perlu impor DataStatistikNasional jika sudah di dalam DashboardDataApi
// import { DataStatistikNasional } from "@/data/statistikProvinsi";

// WilayahKey akan menjadi string karena ID unit kerja/kode BPS adalah string
type WilayahKey = string;

// --- PERBAIKAN: SatkerCard sekarang menerima AggregatedUnitData ---
const SatkerCard: React.FC<{
  satker: AggregatedUnitData; // Mengubah tipe prop satker
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
            {/* Menggunakan namaWilayahAsli dari AggregatedUnitData */}
            {satker.namaWilayahAsli}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {satker.namaSatkerLengkap}
          </p>
        </div>
        <ChevronRightIcon className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-500 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
      {typeof satker.jumlahPegawai === "number" && ( // Menggunakan jumlahPegawai
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          Total Pegawai: {satker.jumlahPegawai.toLocaleString()}
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
  const [dashboardData, setDashboardData] = useState<DashboardDataApi | null>(
    null
  );
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true); // Komponen sudah di-mount
  }, []);

  // --- Fetch data dari API ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setErrorData(null);
      try {
        const response = await fetch("/api/organisasi/dashboard-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardDataApi = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error(
          "Failed to fetch dashboard data for Struktur Organisasi:",
          err
        );
        setErrorData("Gagal memuat data struktur organisasi.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []); // Dependensi kosong agar hanya dijalankan sekali saat mount

  useEffect(() => {
    if (router.isReady && isMounted && dashboardData) {
      const validWilayahKey = wilayahDariQuery as WilayahKey;
      // Gunakan dataStatistikLengkap dari state
      if (
        validWilayahKey &&
        dashboardData.dataStatistikLengkap[validWilayahKey]
      ) {
        setSelectedWilayahUntukStruktur(validWilayahKey);
      } else {
        setSelectedWilayahUntukStruktur(null);
      }
    }
  }, [router.isReady, wilayahDariQuery, isMounted, dashboardData]); // Tambahkan dashboardData sebagai dependency

  const semuaSatkerArray = useMemo(() => {
    if (!dashboardData) return [];
    // Menggunakan dataStatistikLengkap dari state
    return Object.keys(dashboardData.dataStatistikLengkap)
      .map((key) => dashboardData.dataStatistikLengkap[key as WilayahKey])
      .sort((a, b) => {
        if (a.id === "NASIONAL") return -1; // "NASIONAL" karena di API juga menggunakan ini
        if (b.id === "NASIONAL") return 1;
        // Menggunakan namaWilayahAsli untuk sorting
        return (a.namaWilayahAsli || "").localeCompare(b.namaWilayahAsli || "");
      });
  }, [dashboardData]);

  const filteredSatkerList = useMemo(() => {
    if (!searchQuerySatker.trim()) {
      return semuaSatkerArray;
    }
    const queryLower = searchQuerySatker.toLowerCase();
    return semuaSatkerArray.filter(
      (satker) =>
        (satker.namaWilayahAsli || "").toLowerCase().includes(queryLower) ||
        (satker.namaSatkerLengkap || "").toLowerCase().includes(queryLower)
      // namaWilayahAsli sudah mencakup konsep 'nama' untuk filter
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

  if (!isMounted || !router.isReady || isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page dark:bg-surface-page-dark">
        <div className="text-text-primary dark:text-text-primary-dark text-lg animate-pulse">
          Memuat data organisasi...
        </div>
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-red-500">
        <Building2Icon className="mx-auto h-16 w-16 text-red-400" />
        <p className="mt-4 text-xl font-medium">{errorData}</p>
        <p className="text-sm text-red-400">Silakan coba refresh halaman.</p>
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
                  <Building2Icon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
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
