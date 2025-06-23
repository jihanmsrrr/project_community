// pages/ruangbaca/[slug].tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

// Import tipe data Modul dan modulData
import { modulData, Modul } from "@/data/modulData"; // Pastikan path ini benar
import ModulDetailComponent from "@/components/Baca/ModulDetail"; // Import komponen ModulDetail yang bersih

// Import header standar jika Anda ingin konsistensi layout
import PageTitle from "@/components/ui/PageTitle"; // Untuk judul di hero section

export default function SingleModulPage() {
  // Ganti nama function jadi lebih spesifik
  const router = useRouter();
  const { slug } = router.query;

  const [modul, setModul] = useState<Modul | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && slug) {
      // Cari modul berdasarkan slug dari modulData
      const foundModul = modulData
        .flatMap((kategori) => kategori.subKategori.flatMap((sub) => sub.modul))
        .find((m) => m.slug === slug);

      setModul(foundModul || null); // Pastikan set ke null jika tidak ditemukan
      setIsLoading(false);
    }
  }, [router.isReady, slug]);

  // --- Tampilan Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Memuat detail modul...
        </p>
      </div>
    );
  }

  // --- Tampilan Not Found ---
  if (!modul) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center p-8">
        <AlertTriangle className="mx-auto h-16 w-16 text-status-orange mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Modul Tidak Ditemukan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Modul yang Anda cari mungkin tidak ada atau telah dihapus.
        </p>
        <Link href="/ruangbaca" legacyBehavior>
          <a className="inline-flex items-center gap-2 bg-brand-primary text-text-on-brand px-6 py-3 rounded-md hover:bg-brand-primary-hover transition-colors">
            <ArrowLeft size={20} /> Kembali ke Ruang Baca
          </a>
        </Link>
      </div>
    );
  }

  // --- Tampilan Utama (Modul Ditemukan) ---
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      {/* Header standar untuk konsistensi layout */}
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4 text-center">
          <PageTitle
            title={modul.judul} // Judul halaman detail adalah judul modul
            backgroundImage="/title.png" // Sesuaikan path ini
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-grow">
        <ModulDetailComponent
          modul={modul}
          onBack={() => router.push("/ruangbaca")} // Tombol kembali akan navigasi ke halaman Ruang Baca utama
        />
      </main>
    </div>
  );
}
