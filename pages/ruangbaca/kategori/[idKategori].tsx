// pages/ruangbaca/kategori/[idKategori].tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Search as SearchIcon } from "lucide-react"; // Tambahkan SearchIcon
import PageTitle from "@/components/ui/PageTitle";
import MateriCard from "@/components/Baca/MateriCard"; // Pastikan MateriCard sudah diimpor
import Breadcrumb from "@/components/Baca/Breadcrumb"; // Pastikan Breadcrumb diimpor

// Import data dan tipe
import { modulData, Kategori, Modul, SubKategori } from "@/data/modulData";

// Fungsi utilitas untuk menemukan kategori berdasarkan ID
const findKategoriById = (id: string): Kategori | undefined => {
  return modulData.find((k) => k.id === id);
};

export default function KategoriModulPage() {
  const router = useRouter();
  const { idKategori } = router.query; // Ambil ID kategori dari URL

  const [isLoading, setIsLoading] = useState(true);
  const [kategoriData, setKategoriData] = useState<Kategori | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState(""); // State untuk search di halaman kategori

  useEffect(() => {
    if (router.isReady && idKategori) {
      const foundKategori = findKategoriById(idKategori as string);
      setKategoriData(foundKategori);
      setIsLoading(false);
    } else if (router.isReady && !idKategori) {
      // Jika idKategori tidak ada (misal, URL tidak valid), anggap tidak ditemukan
      setIsLoading(false);
      setKategoriData(undefined);
    }
  }, [router.isReady, idKategori]);

  // Logika Filtering Modul di halaman kategori
  const filteredModul = useMemo(() => {
    if (!kategoriData) return [];

    let allModulInKategori: Modul[] = [];
    kategoriData.subKategori.forEach((sub) => {
      allModulInKategori = allModulInKategori.concat(sub.modul);
    });

    const lowerSearchQuery = searchQuery.toLowerCase().trim();
    if (!lowerSearchQuery) {
      return allModulInKategori;
    }

    return allModulInKategori.filter(
      (modul) =>
        modul.judul.toLowerCase().includes(lowerSearchQuery) ||
        modul.deskripsi.toLowerCase().includes(lowerSearchQuery)
    );
  }, [kategoriData, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Memuat kategori...
        </p>
      </div>
    );
  }

  // Not found state
  if (!kategoriData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center p-8">
        <AlertTriangle className="mx-auto h-16 w-16 text-status-orange mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Kategori Tidak Ditemukan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Kategori modul yang Anda cari tidak ada atau URL tidak valid.
        </p>
        <Link href="/ruangbaca" legacyBehavior>
          <a className="inline-flex items-center gap-2 bg-brand-primary text-text-on-brand px-6 py-3 rounded-md hover:bg-brand-primary-hover transition-colors">
            <ArrowLeft size={20} /> Kembali ke Ruang Baca
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      {/* Header standar untuk konsistensi layout */}
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4 text-center">
          <PageTitle
            title={`Ruang Baca: ${kategoriData.namaTampil}`} // Judul halaman sesuai kategori
            backgroundImage="/title.png" // Sesuaikan path ini
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-grow">
        {/* Breadcrumb untuk halaman kategori */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Ruang Baca", href: "/ruangbaca" },
              { label: kategoriData.namaTampil },
            ]}
          />
        </div>

        {/* Search Bar di Halaman Kategori */}
        <section className="mb-8 p-6 bg-surface-card rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Cari di Kategori "{kategoriData.namaTampil}"
          </h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-text-secondary/70" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-ui-border rounded-lg bg-surface-input text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition-shadow"
              placeholder={`Cari modul di ${kategoriData.namaTampil}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Daftar Modul dalam Kategori ini */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Semua Modul
          </h2>
          {filteredModul.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredModul.map((modul) => (
                <MateriCard key={modul.id} modul={modul} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-surface-card rounded-xl">
              <AlertTriangle
                size={48}
                className="mx-auto text-text-secondary/50"
              />
              <h3 className="mt-4 text-xl font-semibold text-text-primary">
                Tidak ada modul yang ditemukan
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Coba sesuaikan kata kunci Anda.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
