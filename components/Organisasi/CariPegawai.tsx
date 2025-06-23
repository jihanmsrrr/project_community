// components/Organisasi/CariPegawai.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router"; // Impor useRouter
import { Search, Filter, ChevronDown, Eye } from "lucide-react"; // XCircle dan DetailPegawai tidak lagi digunakan di sini
import { motion } from "framer-motion"; // AnimatePresence mungkin tidak lagi dibutuhkan di sini jika detail pindah halaman

// DetailPegawai tidak lagi diimpor di sini karena akan pindah ke halaman sendiri
import type { DetailPegawaiData } from "@/types/pegawai";
import { allDummyPegawai } from "@/data/dummyPegawaiService";
import {
  dataStatistikLengkap,
  DataStatistikNasional,
} from "@/data/statistikProvinsi";

const CariPegawai: React.FC = () => {
  const router = useRouter(); // Inisialisasi router

  const [searchQuery, setSearchQuery] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<DetailPegawaiData[]>([]);
  const [satkerFilter, setSatkerFilter] = useState("all");
  const [biroFilter, setBiroFilter] = useState("all");
  // selectedPegawaiUntukDetail dan handleCloseDetail tidak lagi dibutuhkan
  const [hoveredPegawaiId, setHoveredPegawaiId] = useState<string | null>(null);

  useEffect(() => {
    let filteredResults = allDummyPegawai;

    if (satkerFilter !== "all") {
      if (satkerFilter === "Nasional") {
        filteredResults = filteredResults.filter(
          (p) =>
            p.satuanKerjaId === "NASIONAL" ||
            p.satuanKerjaNama === "Nasional" ||
            p.satuanKerjaNama === "Pusat"
        );
      } else {
        filteredResults = filteredResults.filter(
          (p) => p.satuanKerjaNama === satkerFilter
        );
      }
    }

    if (satkerFilter === "Nasional" && biroFilter !== "all") {
      filteredResults = filteredResults.filter(
        (p) => p.unitKerjaEselon1 === biroFilter
      );
    }

    const query = searchQuery.trim().toLowerCase();
    if (query !== "") {
      filteredResults = filteredResults.filter((p) => {
        const nameMatch = p.nama.toLowerCase().includes(query);
        const nipBaruMatch = p.nipBaru
          ? p.nipBaru.toLowerCase().includes(query)
          : false;
        const nipLamaMatch = p.nipLama
          ? p.nipLama.toLowerCase().includes(query)
          : false;
        let satkerNameInQueryMatch = false;
        if (satkerFilter === "all" && p.satuanKerjaNama) {
          satkerNameInQueryMatch = p.satuanKerjaNama
            .toLowerCase()
            .includes(query);
        }
        return (
          nameMatch || nipBaruMatch || nipLamaMatch || satkerNameInQueryMatch
        );
      });
    }

    if (
      searchQuery.trim() === "" &&
      satkerFilter === "all" &&
      biroFilter === "all"
    ) {
      setHasilPencarian([]);
    } else {
      setHasilPencarian(filteredResults);
    }
  }, [searchQuery, satkerFilter, biroFilter]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
    // Tidak perlu lagi menghapus selectedPegawaiUntukDetail
  };

  // PERUBAHAN UTAMA: Fungsi ini akan melakukan navigasi
  const handlePilihPegawaiUntukDetail = (pegawai: DetailPegawaiData) => {
    if (pegawai.nipBaru) {
      router.push(`/organisasi/pegawai/${pegawai.nipBaru}`);
    } else {
      // Fallback jika nipBaru tidak ada (seharusnya tidak terjadi dengan data dummy kita)
      console.warn(
        "NIP Baru pegawai tidak ditemukan, tidak bisa navigasi:",
        pegawai
      );
      // Mungkin tampilkan notifikasi ke pengguna
    }
  };

  const satkerOptions = [
    { value: "all", label: "Semua Satuan Kerja" },
    { value: "Nasional", label: "BPS RI (Pusat)" },
    ...Object.keys(dataStatistikLengkap)
      .filter(
        (key) =>
          key !== "nasional" &&
          dataStatistikLengkap[key as keyof DataStatistikNasional]
      )
      .map((key) => {
        const satker = dataStatistikLengkap[key as keyof DataStatistikNasional];
        return {
          value: satker.namaWilayahAsli,
          label: satker.nama,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const unitKerjaEselon1BPSRIGlobal: string[] = [
    "Sekretariat Utama",
    "Deputi Bidang Statistik Sosial",
    "Deputi Bidang Statistik Produksi",
    "Deputi Bidang Statistik Distribusi dan Jasa",
    "Deputi Bidang Neraca dan Analisis Statistik",
    "Deputi Bidang Metodologi dan Informasi Statistik",
    "Inspektorat Utama",
    "Pusat Pendidikan dan Pelatihan",
  ];

  const biroOptions = [
    { value: "all", label: "Semua Unit Eselon I" },
    ...unitKerjaEselon1BPSRIGlobal.map((unit) => ({
      value: unit,
      label: unit,
    })),
  ];

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div
          className="relative bg-contain bg-no-repeat bg-center rounded-xl shadow-2xl overflow-hidden"
          style={{ backgroundImage: "url('/titlebg2.png')" }}
        >
          <div className="py-6 sm:py-8">
            <div className="relative max-w-lg lg:max-w-xl mx-auto px-4 z-10">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Cari pegawai berdasarkan nama atau NIP..."
                  className="w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg text-base sm:text-lg
                            text-slate-700 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 
                            px-6 py-4 pr-16 sm:pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500"
                />
                <button
                  aria-label="Cari"
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 dark:bg-sky-600 text-white p-2.5 sm:p-3 rounded-md hover:bg-blue-700 dark:hover:bg-sky-700 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-xl">
              <div className="flex items-center gap-2 text-blue-700 dark:text-sky-400 mb-4">
                <Filter size={22} />
                <h2 className="text-lg font-semibold">Filter Pencarian</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="satker"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    Pilih Satuan Kerja
                  </label>
                  <div className="relative">
                    <select
                      id="satker"
                      value={satkerFilter}
                      onChange={(e) => {
                        setSatkerFilter(e.target.value);
                        if (e.target.value !== "Nasional") setBiroFilter("all");
                      }}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                                 text-slate-700 dark:text-slate-200 text-sm rounded-md p-2.5 pr-10 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent transition"
                    >
                      {satkerOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>
                {satkerFilter === "Nasional" && (
                  <div>
                    <label
                      htmlFor="biro"
                      className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5"
                    >
                      Unit Kerja Eselon I (BPS RI)
                    </label>
                    <div className="relative">
                      <select
                        id="biro"
                        value={biroFilter}
                        onChange={(e) => setBiroFilter(e.target.value)}
                        className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                                   text-slate-700 dark:text-slate-200 text-sm rounded-md p-2.5 pr-10
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-transparent transition"
                      >
                        {biroOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-4">
            {/* Bagian ini hanya menampilkan daftar hasil pencarian atau pesan jika tidak ada query */}
            {searchQuery.trim() ||
            satkerFilter !== "all" ||
            biroFilter !== "all" ? (
              <div className="space-y-3">
                {hasilPencarian.length > 0 ? (
                  hasilPencarian.map((pegawai) => (
                    <motion.div
                      key={pegawai.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      // PERUBAHAN: onClick memanggil fungsi navigasi
                      onClick={() => handlePilihPegawaiUntukDetail(pegawai)}
                      onMouseEnter={() => setHoveredPegawaiId(pegawai.id)}
                      onMouseLeave={() => setHoveredPegawaiId(null)}
                      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border 
                                  ${
                                    hoveredPegawaiId === pegawai.id
                                      ? "border-blue-500 dark:border-sky-500 bg-blue-50 dark:bg-sky-900/40"
                                      : "border-slate-200 dark:border-slate-700"
                                  } 
                                  p-4 cursor-pointer transition-all duration-200 hover:shadow-xl flex items-center space-x-4`}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handlePilihPegawaiUntukDetail(pegawai)
                      }
                    >
                      <Image
                        src={
                          pegawai.fotoUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            pegawai.nama
                          )}&size=64&background=random&color=fff&font-size=0.33`
                        }
                        alt={`Foto ${pegawai.nama}`}
                        width={56}
                        height={56}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-base text-slate-800 dark:text-slate-100">
                          {pegawai.nama}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {pegawai.satuanKerjaNama || "Tidak ada data satker"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          NIP: {pegawai.nipBaru || "N/A"}
                        </p>
                      </div>
                      <Eye
                        size={24}
                        className={`flex-shrink-0 transition-colors ${
                          hoveredPegawaiId === pegawai.id
                            ? "text-blue-600 dark:text-sky-500"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
                    {/* Icon XCircle tidak lagi dibutuhkan di sini */}
                    <p className="text-slate-500 dark:text-slate-400">
                      Pegawai tidak ditemukan dengan kriteria tersebut.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Tampilan awal jika tidak ada pencarian/filter aktif
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center mt-6 flex flex-col items-center justify-center min-h-[300px]">
                <Search
                  size={56}
                  className="text-slate-300 dark:text-slate-600 mb-5"
                />
                <p className="text-slate-600 dark:text-slate-300 text-xl font-semibold mb-2">
                  Mulai Cari Pegawai
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
                  Gunakan kolom pencarian di atas atau filter di samping untuk
                  menemukan data pegawai yang Anda cari.
                </p>
              </div>
            )}
            {/* DetailPegawai dan AnimatePresence untuk detail dihapus dari sini */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CariPegawai;
