// app/ruangbaca/page.tsx

"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  LoaderCircle,
  BookOpen,
  FolderKanban,
  BarChart,
  FileText,
  Briefcase,
  Megaphone,
  Scale,
  Users,
  Code,
  Book,
  Gavel,
  Eye,
} from "lucide-react";

import PageTitle from "@/components/ui/PageTitle";
import MateriCard from "@/components/Baca/MateriCard";
import { useDebounce } from "@/pages/hooks/useDebounce"; // Pastikan Anda sudah membuat hook ini

// --- Definisi Tipe Data ---

interface ApiMaterial {
  // --- PERBAIKAN DI SINI ---
  material_id: string; // Pastikan ini string
  uploader_id: string | null; // Pastikan ini string | null
  // -------------------------

  judul: string | null;
  kategori: string | null;
  sub_kategori: string | null;
  deskripsi: string | null;
  file_path: string | null;
  tanggal_upload: string | null; // Data dari JSON adalah string, akan diubah jadi Date nanti
  hits: number;
  uploader?: { nama_lengkap: string | null } | null;
}
interface KategoriGrouped {
  id: string;

  namaTampil: string;

  subKategori: {
    id: string;

    nama: string;

    modul: ApiMaterial[];
  }[];
}

// --- Mapping Tampilan Kategori ---

const kategoriDisplayMap: {
  [key: string]: { icon: React.ElementType; colorClass: string };
} = {
  "Akuntabilitas Kinerja": { icon: CheckCircle, colorClass: "bg-kategori-1" },

  "Asistensi Teknis": { icon: Code, colorClass: "bg-kategori-2" },

  "Diseminasi Statistik": { icon: Megaphone, colorClass: "bg-kategori-3" },

  "Dokumentasi Paparan": { icon: FileText, colorClass: "bg-kategori-4" },

  "Leadership & Manajemen": { icon: Users, colorClass: "bg-kategori-5" },

  "Metodologi Sensus & Survei": { icon: BarChart, colorClass: "bg-kategori-6" },

  "Monitoring & Evaluasi": { icon: Eye, colorClass: "bg-kategori-7" },

  "Pembinaan Statistik": { icon: FolderKanban, colorClass: "bg-kategori-8" },

  "Reformasi Birokrasi": { icon: Briefcase, colorClass: "bg-kategori-9" },

  Regulasi: { icon: Gavel, colorClass: "bg-kategori-10" },

  "Seminar & Workshop": { icon: Book, colorClass: "bg-kategori-11" },

  "Standar Biaya": { icon: Scale, colorClass: "bg-kategori-12" },

  default: { icon: BookOpen, colorClass: "bg-kategori-default" },
};

// === Komponen Utama Halaman ===

export default function RuangBacaPage() {
  // --- State Management ---

  const [masterList, setMasterList] = useState<ApiMaterial[]>([]); // Menyimpan semua data asli untuk dropdown

  const [displayedMaterials, setDisplayedMaterials] = useState<ApiMaterial[]>(
    []
  ); // Data yang akan ditampilkan, bisa terfilter

  const [isLoading, setIsLoading] = useState(true); // Loading untuk setiap fetch

  const [isInitialLoading, setIsInitialLoading] = useState(true); // Loading untuk pertama kali halaman dibuka

  const [hasError, setHasError] = useState(false);

  // State untuk filter

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedKategori, setSelectedKategori] = useState("");

  const [selectedSubKategori, setSelectedSubKategori] = useState("");

  const [sortOrder, setSortOrder] = useState<"hits" | "judul">("hits");

  // Terapkan debounce pada input pencarian

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // --- Logika Data Fetching ---

  // 1. Fetch data awal sekali saja untuk mengisi 'masterList'

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/ruangbaca/materials");

        if (!response.ok) throw new Error("Gagal mengambil data awal");

        const data: ApiMaterial[] = await response.json();

        setMasterList(data);

        setDisplayedMaterials(data); // Awalnya, tampilkan semua materi
      } catch (err) {
        console.error("Error fetching initial data:", err);

        setHasError(true);
      } finally {
        setIsLoading(false);

        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Dependensi kosong, hanya jalan sekali

  // 2. Fetch data terfilter setiap kali filter berubah

  useEffect(() => {
    // Jangan jalankan fetch ini saat halaman pertama kali dimuat

    if (isInitialLoading) return;

    const fetchFilteredMaterials = async () => {
      setIsLoading(true);

      setHasError(false);

      try {
        const params = new URLSearchParams();

        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);

        if (selectedKategori) params.append("kategori", selectedKategori);

        if (selectedSubKategori)
          params.append("sub_kategori", selectedSubKategori);

        // Hanya fetch jika ada filter yang aktif

        if (params.toString()) {
          const response = await fetch(
            `/api/ruangbaca/materials?${params.toString()}`
          );

          if (!response.ok) throw new Error("Gagal mengambil data terfilter");

          const data: ApiMaterial[] = await response.json();

          setDisplayedMaterials(data);
        } else {
          // Jika tidak ada filter, kembalikan ke master list

          setDisplayedMaterials(masterList);
        }
      } catch (err) {
        console.error("Error fetching filtered materials:", err);

        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredMaterials();
  }, [
    debouncedSearchQuery,

    selectedKategori,

    selectedSubKategori,

    isInitialLoading,

    masterList,
  ]);

  // --- Logika untuk Dropdown & Tampilan ---

  // Dropdown kategori dibuat dari masterList agar selalu lengkap

  const availableCategoriesForDropdown = useMemo(() => {
    const categories = new Set<string>();

    masterList.forEach((m) => {
      if (m.kategori) categories.add(m.kategori);
    });

    return Array.from(categories)

      .sort()

      .map((cat) => ({ id: cat, namaTampil: cat }));
  }, [masterList]);

  // Dropdown sub-kategori juga dari masterList agar akurat

  const availableSubCategoriesForDropdown = useMemo(() => {
    if (!selectedKategori) return [];

    const subCategories = new Set<string>();

    masterList.forEach((m) => {
      if (m.kategori === selectedKategori && m.sub_kategori) {
        subCategories.add(m.sub_kategori);
      }
    });

    return Array.from(subCategories)

      .sort()

      .map((sub) => ({ id: sub, nama: sub }));
  }, [selectedKategori, masterList]);

  // Grouping dan Sorting data yang akan ditampilkan

  const groupedData = useMemo(() => {
    const materialsToProcess = [...displayedMaterials];

    materialsToProcess.sort((a, b) => {
      if (sortOrder === "judul")
        return (a.judul || "").localeCompare(b.judul || "");

      return b.hits - a.hits;
    });

    const kategoriMap = new Map<string, KategoriGrouped>();

    materialsToProcess.forEach((material) => {
      if (!material.kategori) return;

      let kategoriEntry = kategoriMap.get(material.kategori);

      if (!kategoriEntry) {
        kategoriEntry = {
          id: material.kategori,

          namaTampil: material.kategori,

          subKategori: [],
        };

        kategoriMap.set(material.kategori, kategoriEntry);
      }

      let subKategoriEntry = kategoriEntry.subKategori.find(
        (sk) => sk.id === (material.sub_kategori || "tanpa-sub-kategori")
      );

      if (!subKategoriEntry) {
        subKategoriEntry = {
          id: material.sub_kategori || "tanpa-sub-kategori",

          nama: material.sub_kategori || "Tanpa Sub-Kategori",

          modul: [],
        };

        kategoriEntry.subKategori.push(subKategoriEntry);
      }

      subKategoriEntry.modul.push(material);
    });

    return Array.from(kategoriMap.values()).sort((a, b) =>
      a.namaTampil.localeCompare(b.namaTampil)
    );
  }, [displayedMaterials, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery("");

    setSelectedKategori("");

    setSelectedSubKategori("");

    setSortOrder("hits");

    setDisplayedMaterials(masterList); // Kembalikan ke daftar lengkap
  };

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <div className="text-center py-10">
          <LoaderCircle className="mx-auto h-12 w-12 text-brand-primary animate-spin" />
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="text-center py-10 bg-red-50 text-red-700 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />

          <h3 className="text-xl font-semibold">Gagal Memuat Data</h3>
        </div>
      );
    }

    const isFilterActive =
      searchQuery.trim() || selectedKategori || selectedSubKategori;

    if (!isFilterActive) {
      // Tampilan Awal: Kartu Kategori

      return (
        <motion.div
          key="initial-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          <h2 className="text-2xl font-bold text-center">
            Direktori Materi Berdasarkan Kategori
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableCategoriesForDropdown.map((kategori) => {
              const categoryInfo =
                kategoriDisplayMap[kategori.namaTampil] ||
                kategoriDisplayMap["default"];

              const IconComponent = categoryInfo.icon;

              return (
                <Link
                  href={`/ruangbaca/kategori/${encodeURIComponent(
                    kategori.id
                  )}`}
                  key={kategori.id}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-md text-white transition-all duration-300 transform hover:scale-105 ${categoryInfo.colorClass}`}
                >
                  <IconComponent size={48} className="mb-4" />

                  <h3 className="text-xl font-semibold text-center">
                    {kategori.namaTampil}
                  </h3>
                </Link>
              );
            })}
          </div>
        </motion.div>
      );
    }

    // Tampilan Hasil Pencarian/Filter

    return (
      <motion.div
        key="search-results-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-bold text-center mb-10">
          Hasil Pencarian
        </h2>

        {isLoading ? (
          <div className="text-center py-10">
            <LoaderCircle className="mx-auto h-12 w-12 text-brand-primary animate-spin" />
          </div>
        ) : groupedData.length > 0 ? (
          <div className="space-y-12">
            {groupedData.map((kategori) => (
              <section key={kategori.id}>
                <h3 className="text-xl sm:text-2xl font-semibold border-b pb-3 mb-6">
                  {kategori.namaTampil}
                </h3>

                <div className="space-y-8">
                  {kategori.subKategori.map((sub) => (
                    <div key={sub.id}>
                      <h4 className="text-lg font-medium mb-4">{sub.nama}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sub.modul.map((modulItem) => (
                          <MateriCard
                            key={modulItem.material_id}
                            modul={{
                              // Tidak ada lagi konversi BigInt, properti langsung diteruskan
                              material_id: modulItem.material_id,
                              uploader_id: modulItem.uploader_id,

                              // Konversi tanggal tetap diperlukan
                              tanggal_upload: modulItem.tanggal_upload
                                ? new Date(modulItem.tanggal_upload)
                                : null,

                              // Properti lainnya
                              judul: modulItem.judul,
                              kategori: modulItem.kategori,
                              sub_kategori: modulItem.sub_kategori,
                              deskripsi: modulItem.deskripsi,
                              file_path: modulItem.file_path,
                              hits: modulItem.hits,
                              uploader: modulItem.uploader,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertTriangle size={48} className="mx-auto text-gray-400" />

            <h3 className="mt-4 text-xl font-semibold">Tidak Ada Hasil</h3>

            <p className="mt-1 text-gray-500">
              Coba sesuaikan filter atau kata kunci Anda.
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="bg-surface-page min-h-screen flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title="Ruang Baca BPS Community"
            backgroundImage="/title.png"
          />
        </div>

        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>

        <div className="relative z-10"></div>
      </div>
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-grow">
        {/* Form Filter */}

        <section className="mb-8 p-6 bg-surface-card rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Cari Materi Ruang Baca
          </h2>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {/* Input Search */}

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>

              <input
                type="text"
                id="search-keyword"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
                placeholder="Cari judul, deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdowns */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                id="kategori-select"
                className="w-full py-2.5 px-3 border rounded-lg"
                value={selectedKategori}
                onChange={(e) => {
                  setSelectedKategori(e.target.value);

                  setSelectedSubKategori("");
                }}
              >
                <option value="">Semua Kategori</option>

                {availableCategoriesForDropdown.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.namaTampil}
                  </option>
                ))}
              </select>

              <select
                id="subkategori-select"
                className="w-full py-2.5 px-3 border rounded-lg"
                value={selectedSubKategori}
                onChange={(e) => setSelectedSubKategori(e.target.value)}
                disabled={
                  !selectedKategori ||
                  availableSubCategoriesForDropdown.length === 0
                }
              >
                <option value="">Semua Topik</option>

                {availableSubCategoriesForDropdown.map((subCat) => (
                  <option key={subCat.id} value={subCat.id}>
                    {subCat.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Reset */}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
              >
                Reset Filter
              </button>
            </div>
          </form>
        </section>

        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>
    </div>
  );
}
