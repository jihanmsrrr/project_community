// pages/varia-statistik/tambahberita.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";

// Impor komponen-komponen yang dibutuhkan
import { useAuth } from "@/contexts/AuthContext";
import BuatBerita from "@/components/Berita/BuatBerita/BuatBerita";
import PageTitle from "@/components/ui/PageTitle"; // Gunakan header standar yang reusable

const TambahBeritaPage: React.FC = () => {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();

  // Cek apakah ada 'id' di URL untuk menentukan mode edit
  const { id: beritaId } = router.query;
  const isEditMode = !!beritaId;

  // Proteksi Halaman: Hanya user yang login yang bisa akses
  useEffect(() => {
    // Jangan lakukan apa-apa jika AuthContext masih loading
    if (authLoading) {
      return;
    }
    // Jika loading selesai dan tidak ada user, tendang ke halaman login
    if (!currentUser) {
      alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");
      router.push("/login");
    }
  }, [currentUser, authLoading, router]);

  // Tampilkan pesan loading selagi AuthContext memeriksa sesi
  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-page">
        <p className="text-text-secondary animate-pulse">
          Memuat dan memverifikasi sesi...
        </p>
      </div>
    );
  }

  // Jika sudah lolos verifikasi, render halaman
  return (
    // Div terluar dengan latar belakang dari tema
    <div className="bg-surface-page min-h-screen">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title={isEditMode ? "Edit Artikel" : "Tulis Artikel Baru"}
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
        <div className="relative z-10"></div>
      </div>

      {/* Konten utama halaman */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Komponen form utama diletakkan di sini */}
        {/* Kita teruskan 'articleId' agar komponen BuatBerita tahu jika ini mode edit */}
        <BuatBerita articleId={beritaId as string | undefined} />
      </main>
    </div>
  );
};

export default TambahBeritaPage;
