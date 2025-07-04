// pages/varia-statistik/tambahberita.tsx
import React from "react";
import { useRouter } from "next/router";
import type { NextPageWithLayout } from "../_app";
import BuatBerita from "@/components/Berita/BuatBerita/BuatBerita";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle"; // Impor PageTitle untuk header

const TambahBeritaPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/login?callbackUrl=${router.asPath}`);
    },
  });

  const { id: beritaId } = router.query;
  const isEditMode = !!beritaId;

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-page">
        <div className="text-center">
          <LoaderCircle className="w-12 h-12 mx-auto animate-spin text-brand-primary" />
          <p className="mt-4 text-text-secondary">Memverifikasi sesi Anda...</p>
        </div>
      </div>
    );
  }

  return (
    // --- PERBAIKAN: Menggunakan layout standar, bukan AdminLayout ---
    <div className="bg-surface-page min-h-screen">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title={isEditMode ? "Edit Artikel" : "Tulis Artikel Baru"}
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <BuatBerita articleId={beritaId as string | undefined} />
      </main>
    </div>
  );
};

export default TambahBeritaPage;
