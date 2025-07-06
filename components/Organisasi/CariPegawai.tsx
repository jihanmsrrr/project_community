// components/Organisasi/CariPegawai.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Search, Filter, ChevronDown, Eye } from "lucide-react";
import { motion } from "framer-motion";

import { Prisma } from "@prisma/client";

// Import tipe dari types/pegawai.ts
import type { DashboardDataApi, AggregatedUnitData } from "@/types/pegawai";

// ASUMSI: Tipe PegawaiUntukPencarian
export type PegawaiUntukPencarian = Prisma.usersGetPayload<{
  select: {
    user_id: true;
    nama_lengkap: true;
    nip_baru: true;
    nip_lama: true;
    foto_url: true;
    unit_kerja_eselon1: true; // string | null
    unit_kerja_eselon2: true; // string | null
    unit_kerja: {
      select: {
        org_unit_id: true;
        nama_wilayah: true;
        kode_bps: true;
        nama_satker_bagian: true;
        nama_wilayah_singkat: true; // string | null
      };
    };
  };
}>;

const CariPegawai: React.FC = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [allPegawaiFromDB, setAllPegawaiFromDB] = useState<
    PegawaiUntukPencarian[]
  >([]);
  const [hasilPencarian, setHasilPencarian] = useState<PegawaiUntukPencarian[]>(
    []
  );
  const [satkerFilter, setSatkerFilter] = useState("all");
  const [biroFilter, setBiroFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [dataStatistikOrganisasi, setDataStatistikOrganisasi] =
    useState<DashboardDataApi | null>(null);

  const [hoveredPegawaiId, setHoveredPegawaiId] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const pegawaiRes = await fetch("/api/organisasi/all-pegawai");
        if (!pegawaiRes.ok) throw new Error("Gagal mengambil data pegawai.");
        const pegawaiData: PegawaiUntukPencarian[] = await pegawaiRes.json();
        setAllPegawaiFromDB(pegawaiData);

        const orgDataRes = await fetch("/api/organisasi/dashboard-data");
        if (!orgDataRes.ok)
          throw new Error("Gagal mengambil data organisasi untuk filter.");

        const orgData: DashboardDataApi = await orgDataRes.json();
        setDataStatistikOrganisasi(orgData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setAllPegawaiFromDB([]);
        setDataStatistikOrganisasi(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let filteredResults: PegawaiUntukPencarian[] = allPegawaiFromDB;

    // Filter berdasarkan Satuan Kerja
    if (satkerFilter !== "all" && dataStatistikOrganisasi) {
      if (satkerFilter === "Nasional") {
        filteredResults = filteredResults.filter(
          (p) => p.unit_kerja?.kode_bps === "0000"
        );
      } else {
        const selectedOrgUnit = Object.values(
          dataStatistikOrganisasi.dataStatistikLengkap
        ).find((ou: AggregatedUnitData) => ou.namaWilayahAsli === satkerFilter);
        if (selectedOrgUnit?.id) {
          filteredResults = filteredResults.filter(
            (p) => p.unit_kerja?.kode_bps === selectedOrgUnit.id
          );
        }
      }
    }

    // Filter berdasarkan Biro (Eselon I) - hanya berlaku jika Satker Nasional dipilih
    if (satkerFilter === "Nasional" && biroFilter !== "all") {
      filteredResults = filteredResults.filter(
        (p) => (p.unit_kerja_eselon1 || "") === biroFilter
      );
    }

    // Filter berdasarkan Query Pencarian
    const query = searchQuery.trim().toLowerCase();
    if (query !== "") {
      filteredResults = filteredResults.filter((p) => {
        const nameMatch = (p.nama_lengkap || "").toLowerCase().includes(query);
        const nipBaruMatch = (p.nip_baru || "").toLowerCase().includes(query);
        const nipLamaMatch = (p.nip_lama || "").toLowerCase().includes(query);

        let satkerNameInQueryMatch = false;
        // --- PERBAIKAN LEBIH KUAT DAN EKSPLISIT DI SINI ---
        if (satkerFilter === "all" && p.unit_kerja) {
          const namaWilayahSingkat = p.unit_kerja.nama_wilayah_singkat;
          // Memastikan namaWilayahSingkat adalah string yang valid
          if (typeof namaWilayahSingkat === "string") {
            // Explicit type check
            satkerNameInQueryMatch = (namaWilayahSingkat as string)
              .toLowerCase()
              .includes(query);
          }
        }
        // --- AKHIR PERBAIKAN ---

        // Also ensure unit_kerja_eselon1 and unit_kerja_eselon2 are handled safely in general search logic
        const eselon1Match = (p.unit_kerja_eselon1 || "")
          .toLowerCase()
          .includes(query);
        const eselon2Match = (p.unit_kerja_eselon2 || "")
          .toLowerCase()
          .includes(query);

        return (
          nameMatch ||
          nipBaruMatch ||
          nipLamaMatch ||
          satkerNameInQueryMatch ||
          eselon1Match ||
          eselon2Match
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
  }, [
    searchQuery,
    satkerFilter,
    biroFilter,
    allPegawaiFromDB,
    dataStatistikOrganisasi,
  ]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handlePilihPegawaiUntukDetail = (pegawai: PegawaiUntukPencarian) => {
    if (pegawai.nip_baru) {
      router.push(`/organisasi/pegawai/${pegawai.nip_baru}`);
    } else {
      console.warn(
        "NIP Baru pegawai tidak ditemukan, tidak bisa navigasi:",
        pegawai
      );
    }
  };

  const satkerOptions = useMemo(() => {
    const options = [
      { value: "all", label: "Semua Satuan Kerja" },
      { value: "Nasional", label: "BPS RI (Pusat)" },
    ];
    if (dataStatistikOrganisasi?.dataStatistikLengkap) {
      Object.values(dataStatistikOrganisasi.dataStatistikLengkap)
        .filter((ou: AggregatedUnitData) => ou.id !== "NASIONAL")
        .forEach((satker: AggregatedUnitData) => {
          options.push({
            value: satker.namaWilayahAsli,
            label: satker.namaWilayahAsli,
          });
        });
    }
    return options.sort((a, b) => a.label.localeCompare(b.label));
  }, [dataStatistikOrganisasi]);

  const unitKerjaEselon1BPSRIGlobal: string[] = useMemo(
    () => [
      "Sekretariat Utama",
      "Deputi Bidang Statistik Sosial",
      "Deputi Bidang Statistik Produksi",
      "Deputi Bidang Statistik Distribusi dan Jasa",
      "Deputi Bidang Neraca dan Analisis Statistik",
      "Deputi Bidang Metodologi dan Informasi Statistik",
      "Inspektorat Utama",
      "Pusat Pendidikan dan Pelatihan",
    ],
    []
  );

  const biroOptions = useMemo(() => {
    return [
      { value: "all", label: "Semua Unit Eselon I" },
      ...unitKerjaEselon1BPSRIGlobal.map((unit) => ({
        value: unit,
        label: unit,
      })),
    ];
  }, [unitKerjaEselon1BPSRIGlobal]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
        <p>Memuat data pegawai...</p>
      </div>
    );
  }

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
            {searchQuery.trim() ||
            satkerFilter !== "all" ||
            biroFilter !== "all" ? (
              <div className="space-y-3">
                {hasilPencarian.length > 0 ? (
                  hasilPencarian.map((pegawai) => (
                    <motion.div
                      key={pegawai.user_id.toString()}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handlePilihPegawaiUntukDetail(pegawai)}
                      onMouseEnter={() => setHoveredPegawaiId(pegawai.user_id)}
                      onMouseLeave={() => setHoveredPegawaiId(null)}
                      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border 
                                  ${
                                    hoveredPegawaiId === pegawai.user_id
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
                          pegawai.foto_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            pegawai.nama_lengkap || "Pegawai"
                          )}&size=64&background=random&color=fff&font-size=0.33`
                        }
                        alt={`Foto ${pegawai.nama_lengkap}`}
                        width={56}
                        height={56}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-base text-slate-800 dark:text-slate-100">
                          {pegawai.nama_lengkap}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {pegawai.unit_kerja?.nama_wilayah_singkat ||
                            pegawai.unit_kerja_eselon2 ||
                            "Tidak ada data satker"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          NIP: {pegawai.nip_baru || "N/A"}
                        </p>
                      </div>
                      <Eye
                        size={24}
                        className={`flex-shrink-0 transition-colors ${
                          hoveredPegawaiId === pegawai.user_id
                            ? "text-blue-600 dark:text-sky-500"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      Pegawai tidak ditemukan dengan kriteria tersebut.
                    </p>
                  </div>
                )}
              </div>
            ) : (
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default CariPegawai;
