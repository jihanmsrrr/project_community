// components/Organisasi/CariPegawai.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Search, Filter, ChevronDown, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import types from the centralized types file
import type { PegawaiSearchResult, SatkerOption } from "@/types/pegawai";
import Breadcrumb from "@/components/ui/Breadcrumb";

const CariPegawai: React.FC = () => {
  const router = useRouter();

  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [satkerFilter, setSatkerFilter] = useState("all");
  const [biroFilter, setBiroFilter] = useState("all");
  const [hasilPencarian, setHasilPencarian] = useState<PegawaiSearchResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [satkerOptionsData, setSatkerOptionsData] = useState<SatkerOption[]>(
    []
  );
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [hoveredPegawaiId, setHoveredPegawaiId] = useState<string | null>(null);

  // --- Data Fetching & Handlers ---
  useEffect(() => {
    fetch("/api/organisasi/list-satker")
      .then((res) => res.json())
      .then((data: SatkerOption[]) => setSatkerOptionsData(data))
      .catch((err) => console.error("Gagal mengambil data filter:", err))
      .finally(() => setIsLoadingFilters(false));
  }, []);

  const handleSearch = useCallback(async () => {
    if (
      searchQuery.trim() === "" &&
      satkerFilter === "all" &&
      biroFilter === "all"
    ) {
      setHasilPencarian([]);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
        satker: satkerFilter,
        biro: biroFilter,
      });
      const response = await fetch(
        `/api/organisasi/pegawai/search?${params.toString()}`
      );
      if (!response.ok) throw new Error("Gagal mencari pegawai.");
      const data = await response.json();
      setHasilPencarian(data);
    } catch (error) {
      console.error("Error during search:", error);
      setHasilPencarian([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, satkerFilter, biroFilter]);

  useEffect(() => {
    if (hasSearched) {
      const timer = setTimeout(handleSearch, 300);
      return () => clearTimeout(timer);
    }
  }, [satkerFilter, biroFilter, hasSearched, handleSearch]);

  const handlePilihPegawaiUntukDetail = (pegawai: PegawaiSearchResult) => {
    if (pegawai.nip_baru)
      router.push(`/organisasi/pegawai/${pegawai.nip_baru}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSatkerFilter("all");
    setBiroFilter("all");
    setHasilPencarian([]);
    setHasSearched(false);
  };

  // --- Memoized Options ---
  const satkerOptions = useMemo(() => {
    const options = [{ value: "all", label: "Semua Satuan Kerja" }];
    const bpsPusat = satkerOptionsData.find((s) => s.kode_bps === "0000");
    if (bpsPusat) {
      options.push({ value: bpsPusat.kode_bps!, label: "BPS RI (Pusat)" });
    }
    satkerOptionsData
      .filter((s) => s.kode_bps !== "0000" && s.nama_wilayah)
      .forEach((satker) => {
        options.push({
          value: satker.kode_bps!,
          label: `BPS Prov. ${satker.nama_wilayah}`,
        });
      });
    return options;
  }, [satkerOptionsData]);

  const biroOptions = useMemo(() => {
    const eselon1Units = [
      "Sekretariat Utama",
      "Deputi Bidang Statistik Sosial",
      "Deputi Bidang Statistik Produksi",
      "Deputi Bidang Statistik Distribusi dan Jasa",
      "Deputi Bidang Neraca dan Analisis Statistik",
      "Deputi Bidang Metodologi dan Informasi Statistik",
      "Inspektorat Utama",
      "Pusat Pendidikan dan Pelatihan",
    ];
    return [
      { value: "all", label: "Semua Unit Eselon I" },
      ...eselon1Units.map((unit) => ({ value: unit, label: unit })),
    ];
  }, []);

  // --- Dynamic Breadcrumbs ---
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: "Direktori Pegawai", href: "/organisasi/pegawai" },
    ];
    if (searchQuery.trim())
      items.push({ label: `Mencari \"${searchQuery.trim()}\"` });
    if (satkerFilter !== "all") {
      const label = satkerOptions.find(
        (opt) => opt.value === satkerFilter
      )?.label;
      if (label) items.push({ label: `di ${label}` });
    }
    if (biroFilter !== "all") {
      const label = biroOptions.find((opt) => opt.value === biroFilter)?.label;
      if (label) items.push({ label: `Unit ${label}` });
    }
    return items;
  }, [searchQuery, satkerFilter, biroFilter, satkerOptions, biroOptions]);

  if (isLoadingFilters) {
    return (
      <div className="text-center py-20 text-slate-500">
        Memuat komponen pencarian...
      </div>
    );
  }
  // --- Render Logic ---
  if (isLoadingFilters) {
    return (
      <div className="text-center py-20 text-slate-500">
        Memuat komponen pencarian...
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl px-4"
        >
          <Search
            size={56}
            className="text-slate-300 dark:text-slate-600 mx-auto mb-5"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Mulai Cari Pegawai
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-md mx-auto">
            Gunakan kolom pencarian di bawah untuk menemukan profil pegawai BPS
            di seluruh Indonesia.
          </p>
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Ketik Nama atau NIP lalu tekan Enter..."
              className="w-full text-base sm:text-lg px-6 py-4 pr-16 rounded-full border-2 border-input-border bg-input-bg focus:ring-brand-text focus:border-brand-text transition shadow-lg"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-bg text-white p-3 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
              aria-label="Cari"
            >
              <Search size={22} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <aside className="lg:col-span-3 space-y-6 sticky top-24">
        <div className="bg-card border border-card-border p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between gap-3 text-brand-text mb-5">
            <div className="flex items-center gap-3">
              <Filter size={22} />
              <h2 className="text-xl font-bold">Filter</h2>
            </div>
            <button
              onClick={clearSearch}
              className="text-xs text-slate-500 hover:text-brand-text hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="search-sidebar"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block"
              >
                Nama / NIP
              </label>
              <div className="relative">
                <input
                  id="search-sidebar"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Cari lagi..."
                  className="w-full text-sm px-3 py-2 pr-9 rounded-md border border-input-border bg-input-bg focus:ring-brand-text focus:border-brand-text"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-text"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="satker-filter"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5"
              >
                Satuan Kerja
              </label>
              <div className="relative">
                <select
                  id="satker-filter"
                  value={satkerFilter}
                  onChange={(e) => setSatkerFilter(e.target.value)}
                  className="w-full appearance-none bg-input-bg border border-input-border text-sm rounded-md p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-text focus:border-transparent transition"
                >
                  {satkerOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
            {satkerFilter === "0000" && (
              <div>
                <label
                  htmlFor="biro-filter"
                  className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5"
                >
                  Unit Kerja Eselon I
                </label>
                <div className="relative">
                  <select
                    id="biro-filter"
                    value={biroFilter}
                    onChange={(e) => setBiroFilter(e.target.value)}
                    className="w-full appearance-none bg-input-bg border border-input-border text-sm rounded-md p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-text focus:border-transparent transition"
                  >
                    {biroOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="lg:col-span-9">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-slate-500">Mencari hasil...</p>
          </div>
        ) : (
          <AnimatePresence>
            {hasilPencarian.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                className="space-y-3"
              >
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Menampilkan {hasilPencarian.length} hasil yang relevan.
                </p>
                {hasilPencarian.map((pegawai) => (
                  <motion.div
                    key={pegawai.user_id.toString()}
                    onClick={() => handlePilihPegawaiUntukDetail(pegawai)}
                    onMouseEnter={() =>
                      setHoveredPegawaiId(pegawai.user_id.toString())
                    }
                    onMouseLeave={() => setHoveredPegawaiId(null)}
                    className={`bg-card border rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                      hoveredPegawaiId === pegawai.user_id.toString()
                        ? "border-brand-text ring-2 ring-brand-text/20"
                        : "border-card-border"
                    }`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                      <Image
                        src={
                          pegawai.foto_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            pegawai.nama_lengkap || "P"
                          )}&size=64&background=random&color=fff`
                        }
                        alt={`Foto ${pegawai.nama_lengkap}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-base text-slate-800 dark:text-slate-100">
                        {pegawai.nama_lengkap}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {pegawai.unit_kerja?.nama_satker_lengkap ||
                          "Satker tidak tersedia"}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        NIP: {pegawai.nip_baru || "N/A"}
                      </p>
                    </div>
                    <Eye
                      size={24}
                      className={`transition-colors ${
                        hoveredPegawaiId === pegawai.user_id.toString()
                          ? "text-brand-text"
                          : "text-slate-400"
                      }`}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-card border border-card-border rounded-xl shadow-md">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Tidak Ada Hasil Ditemukan
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Coba gunakan kata kunci atau filter yang berbeda.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default CariPegawai;
