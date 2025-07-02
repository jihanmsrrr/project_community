// pages/ruang-baca.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  LoaderCircle,
  BookOpen, // Untuk ikon kategori umum
  FolderKanban, // Contoh ikon untuk kategori
  BarChart, // Contoh ikon untuk kategori
  FileText, // Contoh ikon untuk kategori
  Briefcase, // Contoh ikon untuk kategori
  Megaphone, // Contoh ikon untuk kategori
  Scale, // Contoh ikon untuk kategori
  TrendingUp, // Contoh ikon untuk kategori
  Lightbulb, // Contoh ikon untuk kategori
  Users, // Contoh ikon untuk kategori
  Code, // Contoh ikon untuk kategori
  Book, // Contoh ikon untuk kategori
  Gavel,
  Eye, // Contoh ikon untuk kategori
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";

import MateriCard from "@/components/Baca/MateriCard";

// =======================================================================
// === DEFINISI TIPE BARU UNTUK DATA API DAN GROUPING ===
// =======================================================================

interface ApiMaterial {
  material_id: string;
  judul: string | null;
  kategori: string | null;
  sub_kategori: string | null;
  deskripsi: string | null;
  file_path: string | null;
  uploader_id: string | null;
  tanggal_upload: string | null;
  hits: number;
  uploader?: {
    nama_lengkap: string | null;
  } | null;
}

interface ModulGrouped {
  material_id: string;
  judul: string | null;
  deskripsi: string | null;
  hits: number;
  file_path: string | null;
  kategori: string | null;
  sub_kategori: string | null;
  uploader?: { nama_lengkap: string | null } | null;
  uploader_id?: string | null;
  tanggal_upload?: string | null;
}

interface SubKategoriGrouped {
  id: string;
  nama: string;
  modul: ModulGrouped[];
}

interface KategoriGrouped {
  id: string;
  namaTampil: string;
  tahun: number;
  subKategori: SubKategoriGrouped[];
}

// === Mapping Kategori ke Ikon dan Warna ===
const kategoriDisplayMap: {
  [key: string]: { icon: React.ElementType; colorClass: string };
} = {
  "pembinaan-statistik": { icon: FolderKanban, colorClass: "bg-blue-500" },
  metodologi: { icon: BarChart, colorClass: "bg-green-500" },
  "paparan-rilis": { icon: Megaphone, colorClass: "bg-purple-500" },
  "kompetisi-inovasi": { icon: Lightbulb, colorClass: "bg-yellow-500" },
  "monitoring-evaluasi": { icon: Eye, colorClass: "bg-red-500" },
  "standar-biaya": { icon: Scale, colorClass: "bg-indigo-500" },
  "akuntabilitas-sakip": { icon: CheckCircle, colorClass: "bg-teal-500" },
  "diseminasi-statistik": { icon: TrendingUp, colorClass: "bg-orange-500" },
  "leadership-manajemen": { icon: Users, colorClass: "bg-pink-500" },
  "asistensi-teknis": { icon: Code, colorClass: "bg-cyan-500" },
  "seminar-workshop": { icon: Book, colorClass: "bg-lime-500" },
  "varia-statistik-bacaan": { icon: FileText, colorClass: "bg-fuchsia-500" },
  "reformasi-birokrasi": { icon: Briefcase, colorClass: "bg-emerald-500" },
  regulasi: { icon: Gavel, colorClass: "bg-gray-500" },
  // Tambahkan kategori lain jika ada
};

// =======================================================================
// === KOMPONEN UTAMA HALAMAN (RuangBacaPage) ===
// =======================================================================

const Toast = ({ message, show }: { message: string; show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-xl animate-fade-in-up flex items-center gap-2 z-50">
      <CheckCircle size={20} />
      <span>{message}</span>
    </div>
  );
};

export default function RuangBacaPage() {
  const [allMaterials, setAllMaterials] = useState<ApiMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedSubKategori, setSelectedSubKategori] = useState("");
  const [sortOrder, setSortOrder] = useState<"hits" | "judul">("hits");

  const [toastInfo] = useState({ message: "", show: false });

  // === Fetch semua materi bacaan dari API saat komponen dimuat ===
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await fetch("/api/ruangbaca-materials");
        if (!response.ok) {
          throw new Error("Failed to fetch reading materials");
        }
        const data: ApiMaterial[] = await response.json();
        setAllMaterials(data);
      } catch (err) {
        console.error("Error fetching all materials:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // === Mengelompokkan dan Memfilter Data ===
  const filteredAndGroupedData = useMemo(() => {
    let currentFilteredMaterials = [...allMaterials];

    if (selectedKategori) {
      currentFilteredMaterials = currentFilteredMaterials.filter(
        (m) => m.kategori === selectedKategori
      );
    }

    if (selectedSubKategori) {
      currentFilteredMaterials = currentFilteredMaterials.filter(
        (m) => m.sub_kategori === selectedSubKategori
      );
    }

    const lowerSearchQuery = searchQuery.toLowerCase().trim();
    if (lowerSearchQuery) {
      currentFilteredMaterials = currentFilteredMaterials.filter(
        (m) =>
          (m.judul && m.judul.toLowerCase().includes(lowerSearchQuery)) ||
          (m.deskripsi && m.deskripsi.toLowerCase().includes(lowerSearchQuery))
      );
    }

    currentFilteredMaterials.sort((a, b) => {
      if (sortOrder === "judul") {
        return (a.judul || "").localeCompare(b.judul || "");
      }
      return b.hits - a.hits;
    });

    const groupedData: KategoriGrouped[] = [];
    const kategoriMap = new Map<string, KategoriGrouped>();
    const subKategoriMap = new Map<string, SubKategoriGrouped>();

    currentFilteredMaterials.forEach((material) => {
      if (!material.kategori) return;

      let kategoriEntry = kategoriMap.get(material.kategori);
      if (!kategoriEntry) {
        kategoriEntry = {
          id: material.kategori,
          namaTampil: material.kategori
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          tahun: new Date(material.tanggal_upload || new Date()).getFullYear(),
          subKategori: [],
        };
        kategoriMap.set(material.kategori, kategoriEntry);
        groupedData.push(kategoriEntry);
      }

      const subKategoriKey =
        material.kategori +
        "::" +
        (material.sub_kategori || "tanpa-sub-kategori");
      let subKategoriEntry = subKategoriMap.get(subKategoriKey);
      if (!subKategoriEntry) {
        subKategoriEntry = {
          id: material.sub_kategori || "tanpa-sub-kategori",
          nama: material.sub_kategori || "Tanpa Sub-Kategori",
          modul: [],
        };
        subKategoriMap.set(subKategoriKey, subKategoriEntry);
        kategoriEntry.subKategori.push(subKategoriEntry);
      }

      subKategoriEntry.modul.push({
        material_id: material.material_id,
        judul: material.judul,
        deskripsi: material.deskripsi,
        hits: material.hits,
        file_path: material.file_path,
        kategori: material.kategori,
        sub_kategori: material.sub_kategori,
        uploader: material.uploader,
        uploader_id: material.uploader_id,
        tanggal_upload: material.tanggal_upload,
      });
    });

    groupedData.sort((a, b) => a.namaTampil.localeCompare(b.namaTampil));
    groupedData.forEach((kat) => {
      kat.subKategori.sort((a, b) => a.nama.localeCompare(b.nama));
    });

    return groupedData;
  }, [
    allMaterials,
    searchQuery,
    selectedKategori,
    selectedSubKategori,
    sortOrder,
  ]);

  // === Opsi Dropdown Dinamis dari data yang sudah diambil ===
  const availableCategoriesForDropdown = useMemo(() => {
    const categories = new Set<string>();
    allMaterials.forEach((m) => {
      if (m.kategori) categories.add(m.kategori);
    });
    return Array.from(categories)
      .sort()
      .map((cat) => ({
        id: cat,
        namaTampil: cat
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      }));
  }, [allMaterials]);

  const availableSubCategoriesForDropdown = useMemo(() => {
    if (!selectedKategori) return [];
    const subCategories = new Set<string>();
    allMaterials.forEach((m) => {
      if (m.kategori === selectedKategori && m.sub_kategori) {
        subCategories.add(m.sub_kategori);
      }
    });
    return Array.from(subCategories)
      .sort()
      .map((sub) => ({
        id: sub,
        nama: sub.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      }));
  }, [selectedKategori, allMaterials]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedKategori("");
    setSelectedSubKategori("");
    setSortOrder("hits");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10 bg-surface-card rounded-xl">
          <LoaderCircle className="mx-auto h-12 w-12 text-brand-primary animate-spin mb-4" />
          <p className="text-lg text-text-primary">Memuat materi...</p>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="text-center py-10 bg-feedback-error-bg rounded-xl border border-feedback-error-border text-feedback-error-text">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Gagal Memuat Data</h3>
          <p>
            Terjadi kesalahan saat mengambil materi. Silakan coba lagi nanti.
          </p>
        </div>
      );
    }

    // --- PERBAIKAN: Tampilan Awal Hanya Menampilkan Kategori Cards ---
    if (!searchQuery.trim() && !selectedKategori && !selectedSubKategori) {
      return (
        <motion.div
          key="initial-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-10"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Direktori Materi Berdasarkan Kategori
          </h2>
          {availableCategoriesForDropdown.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableCategoriesForDropdown.map((kategori) => {
                const categoryInfo = kategoriDisplayMap[kategori.id] || {
                  icon: BookOpen,
                  colorClass: "bg-gray-500",
                };
                const IconComponent = categoryInfo.icon;
                return (
                  <Link
                    href={`/ruangbaca/kategori/${kategori.id}`}
                    legacyBehavior
                    key={kategori.id}
                  >
                    <a
                      className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-md text-white transition-all duration-300 transform hover:scale-105 ${categoryInfo.colorClass}`}
                    >
                      <IconComponent size={48} className="mb-4" />
                      <h3 className="text-xl font-semibold text-center">
                        {kategori.namaTampil}
                      </h3>
                      <p className="text-sm text-white/80 mt-1">
                        {kategori.id
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </a>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-card rounded-xl">
              <AlertTriangle
                size={48}
                className="mx-auto text-text-secondary/50"
              />
              <h3 className="mt-4 text-xl font-semibold text-text-primary">
                Tidak Ada Kategori Tersedia
              </h3>
              <p className="mt-1 text-text-secondary">
                Mohon maaf, tidak ada kategori materi yang tersedia saat ini.
              </p>
            </div>
          )}
        </motion.div>
      );
    }

    // Tampilan Hasil Pencarian (tetap sama)
    return (
      <motion.div
        key="search-results-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-10"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Hasil Pencarian
        </h2>
        {filteredAndGroupedData.length > 0 ? (
          filteredAndGroupedData.map((kategori) => (
            <section key={kategori.id} className="mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-text-secondary border-b border-ui-border pb-3 mb-6">
                {kategori.namaTampil}
              </h3>
              <div className="space-y-8">
                {kategori.subKategori.map((sub) => (
                  <div key={sub.id}>
                    <h4 className="text-lg font-medium text-text-primary/80 mb-4">
                      {sub.nama}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {sub.modul.map((modulItem) => (
                        <MateriCard
                          key={modulItem.material_id}
                          modul={{
                            material_id: BigInt(modulItem.material_id),
                            judul: modulItem.judul,
                            kategori: modulItem.kategori,
                            sub_kategori: modulItem.sub_kategori,
                            deskripsi: modulItem.deskripsi,
                            file_path: modulItem.file_path,
                            hits: modulItem.hits,
                            uploader: modulItem.uploader,
                            uploader_id: modulItem.uploader_id
                              ? BigInt(modulItem.uploader_id)
                              : null,
                            tanggal_upload: modulItem.tanggal_upload
                              ? new Date(modulItem.tanggal_upload)
                              : null,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-16 bg-surface-card rounded-xl">
            <AlertTriangle
              size={48}
              className="mx-auto text-text-secondary/50"
            />
            <h3 className="mt-4 text-xl font-semibold text-text-primary">
              Tidak Ada Hasil
            </h3>
            <p className="mt-1 text-text-secondary">
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
        {/* Search & Filter Form */}
        <section className="mb-8 p-6 bg-surface-card rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Cari Materi Ruang Baca
          </h2>
          <p className="text-text-secondary text-center mb-6">
            Temukan dokumen, panduan, dan materi yang Anda butuhkan dengan
            mudah.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="search-keyword" className="sr-only">
                Kata Kunci
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-text-secondary/70" />
                </span>
                <input
                  type="text"
                  id="search-keyword"
                  className="w-full pl-10 pr-4 py-2.5 border border-ui-border rounded-lg bg-surface-input text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition-shadow"
                  placeholder="Cari judul, deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="kategori-select"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Kategori
                </label>
                <select
                  id="kategori-select"
                  className="w-full py-2.5 px-3 border border-ui-border rounded-lg bg-surface-input text-text-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  value={selectedKategori}
                  onChange={(e) => {
                    setSelectedKategori(e.target.value);
                    setSelectedSubKategori(""); // Reset sub-kategori saat kategori berubah
                  }}
                >
                  <option value="">Semua Kategori</option>
                  {availableCategoriesForDropdown.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.namaTampil}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="subkategori-select"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Sub-Kategori / Topik
                </label>
                <select
                  id="subkategori-select"
                  className="w-full py-2.5 px-3 border border-ui-border rounded-lg bg-surface-input text-text-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
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
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-ui-border text-text-secondary rounded-lg font-semibold hover:bg-ui-border/80 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </form>
        </section>

        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>
      <Toast message={toastInfo.message} show={toastInfo.show} />
    </div>
  );
}
