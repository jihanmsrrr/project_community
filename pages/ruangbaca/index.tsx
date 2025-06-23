// pages/ruang-baca.tsx
"use client";

import React, { useState, useMemo } from "react"; // Tambahkan useMemo
import { ChevronRight, Search, CheckCircle, AlertTriangle } from "lucide-react"; // Tambahkan Search, CheckCircle, AlertTriangle
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css"; // Tidak yakin ini masih dipakai, bisa dihapus jika tidak
import "slick-carousel/slick/slick-theme.css"; // Tidak yakin ini masih dipakai, bisa dihapus jika tidak
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link"; // Tambahkan Link

// --- IMPOR KOMPONEN DAN DATA ---
import { modulData, Kategori } from "@/data/modulData"; // PASTIKAN PATH INI BENAR

// Asumsi semua komponen ini sudah ada di file terpisah
// SearchComponent akan kita benahi langsung di sini atau tetap sebagai komponen terpisah jika kompleks
// import SearchComponent, { SearchParams } from "@/components/Baca/SearchComponent"; // Kita akan integrasikan atau revisi ini
import MateriCard from "@/components/Baca/MateriCard"; // Pastikan MateriCard sudah diperbarui seperti di atas

// =======================================================================
// === KOMPONEN UTAMA HALAMAN (RuangBacaPage) ===
// =======================================================================

// --- Komponen Toast (Saya pindahkan ke sini untuk contoh) ---
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategoriId, setSelectedKategoriId] = useState(""); // Untuk dropdown Kategori
  const [selectedSubKategoriId, setSelectedSubKategoriId] = useState(""); // Untuk dropdown Sub-Kategori
  const [sortOrder, setSortOrder] = useState<"terbaru" | "judul">("terbaru"); // Urutkan
  const [toastInfo, setToastInfo] = useState({ message: "", show: false });

  // Fungsi untuk menampilkan Toast
  const handleShowToast = (message: string) => {
    setToastInfo({ message, show: true });
    setTimeout(() => setToastInfo({ message: "", show: false }), 3000);
  };

  // Mendapatkan daftar Kategori unik untuk dropdown
  const availableCategories = useMemo(() => {
    return modulData.map((k) => ({ id: k.id, namaTampil: k.namaTampil }));
  }, []);

  // Mendapatkan daftar Sub-Kategori unik berdasarkan Kategori yang dipilih
  const availableSubCategories = useMemo(() => {
    if (!selectedKategoriId) return [];
    const kategori = modulData.find((k) => k.id === selectedKategoriId);
    return kategori
      ? kategori.subKategori.map((s) => ({ id: s.id, nama: s.nama }))
      : [];
  }, [selectedKategoriId]);

  // Logika Filtering dan Sorting
  const filteredData = useMemo(() => {
    let currentData: Kategori[] = JSON.parse(JSON.stringify(modulData)); // Deep copy untuk manipulasi

    // Filter by Kategori
    if (selectedKategoriId) {
      currentData = currentData.filter(
        (kategori) => kategori.id === selectedKategoriId
      );
    }

    // Filter by Sub-Kategori (hanya berlaku jika kategori sudah difilter)
    if (selectedSubKategoriId && currentData.length > 0) {
      currentData = currentData
        .map((kategori) => {
          const filteredSubKategori = kategori.subKategori.filter(
            (sub) => sub.id === selectedSubKategoriId
          );
          return { ...kategori, subKategori: filteredSubKategori };
        })
        .filter((kategori) => kategori.subKategori.length > 0); // Hapus kategori tanpa sub-kategori yang cocok
    }

    // Filter by Keyword
    const lowerSearchQuery = searchQuery.toLowerCase().trim();
    if (lowerSearchQuery) {
      currentData = currentData
        .map((kategori) => {
          const filteredSubKategori = kategori.subKategori
            .map((sub) => {
              const filteredModul = sub.modul.filter(
                (modul) =>
                  modul.judul.toLowerCase().includes(lowerSearchQuery) ||
                  modul.deskripsi.toLowerCase().includes(lowerSearchQuery)
              );
              return { ...sub, modul: filteredModul };
            })
            .filter((sub) => sub.modul.length > 0); // Hapus sub-kategori tanpa modul yang cocok
          return { ...kategori, subKategori: filteredSubKategori };
        })
        .filter((kategori) => kategori.subKategori.length > 0); // Hapus kategori tanpa sub-kategori yang cocok
    }

    // Apply Sorting
    currentData.forEach((kategori) => {
      kategori.subKategori.forEach((sub) => {
        sub.modul.sort((a, b) => {
          if (sortOrder === "judul") {
            return a.judul.localeCompare(b.judul);
          }
          // Default sorting by hits (terbaru berdasarkan hits tertinggi)
          return b.hits - a.hits;
        });
      });
    });

    return currentData;
  }, [searchQuery, selectedKategoriId, selectedSubKategoriId, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedKategoriId("");
    setSelectedSubKategoriId("");
    setSortOrder("terbaru");
  };

  // Logika Render Utama
  const renderContent = () => {
    // Tampilan Etalase Awal (jika tidak ada keyword dan filter)
    if (!searchQuery.trim() && !selectedKategoriId && !selectedSubKategoriId) {
      return (
        <motion.div
          key="initial-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Tambahkan exit
          className="space-y-10"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Jelajahi Kategori Materi
          </h2>
          {modulData.map((kategori) => (
            <div key={kategori.id}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-text-primary capitalize">
                  {kategori.namaTampil}
                </h3>
                <Link
                  href={`/ruangbaca/kategori/${kategori.id}`}
                  className="text-sm font-medium text-brand-primary hover:underline flex items-center gap-1"
                >
                  {" "}
                  {/* Ini sudah benar sekarang, pastikan tidak ada legacyBehavior */}
                  <span>
                    Lihat Semua <ChevronRight size={16} />
                  </span>{" "}
                  {/* Bungkus teks dan ikon dalam satu span */}
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {kategori.subKategori
                  .flatMap((sub) => sub.modul)
                  .slice(0, 4) // Hanya tampilkan 4 modul per kategori
                  .map((modul) => (
                    <MateriCard key={modul.id} modul={modul} />
                  ))}
              </div>
            </div>
          ))}
        </motion.div>
      );
    }

    // Tampilan Hasil Pencarian
    return (
      <motion.div
        key="search-results-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Tambahkan exit
        className="space-y-10" // Hapus grid col di sini, ini akan jadi container modul list
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Hasil Pencarian
        </h2>
        {filteredData.length > 0 ? (
          filteredData.map((kategori) => (
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
                      {sub.modul.map((modul) => (
                        <MateriCard key={modul.id} modul={modul} />
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
      <main className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-grow">
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
                  value={selectedKategoriId}
                  onChange={(e) => {
                    setSelectedKategoriId(e.target.value);
                    setSelectedSubKategoriId(""); // Reset sub-kategori saat kategori berubah
                  }}
                >
                  <option value="">Semua Kategori</option>
                  {availableCategories.map((cat) => (
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
                  value={selectedSubKategoriId}
                  onChange={(e) => setSelectedSubKategoriId(e.target.value)}
                  disabled={!selectedKategoriId} // Disable jika belum ada kategori terpilih
                >
                  <option value="">Semua Topik</option>
                  {availableSubCategories.map((subCat) => (
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
              {/* Tombol Cari tidak lagi memicu handleSearch karena filter sudah live */}
              {/* <button type="submit" className="px-5 py-2.5 bg-brand-primary text-text-on-brand rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors">
                <Search size={18} className="inline mr-2" /> Cari
              </button> */}
            </div>
          </form>
        </section>

        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>
      <Toast message={toastInfo.message} show={toastInfo.show} />
    </div>
  );
}
