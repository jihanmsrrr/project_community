"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Definisikan tipe untuk data berita yang diterima dari API
interface Berita {
  news_id: number;
  judul: string;
  publishedAt: string;
  abstrak: string;
  gambar: string;
}

// Komponen Card Berita (tidak ada perubahan fungsional)
const BeritaCard: React.FC<{ berita: Berita; index: number }> = ({
  berita,
  index,
}) => {
  return (
    <Link href={`/berita/${berita.news_id}`} passHref>
      <motion.a
        className="bg-surface-card rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={berita.gambar || "/placeholder.png"}
            alt={berita.judul}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 2}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-text-secondary opacity-80 mb-1">
            {new Date(berita.publishedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2 line-clamp-2 break-words group-hover:text-brand-primary transition-colors">
            {berita.judul}
          </h3>
          <p className="text-sm text-text-secondary flex-grow line-clamp-3 break-words">
            {berita.abstrak}
          </p>
        </div>
      </motion.a>
    </Link>
  );
};

// Komponen Skeleton untuk loading state
const CardSkeleton = () => (
  <div className="bg-surface-card rounded-2xl shadow-lg overflow-hidden">
    <div className="w-full aspect-[16/9] bg-ui-border animate-pulse"></div>
    <div className="p-4 space-y-3">
      <div className="h-3 w-1/3 bg-ui-border rounded-full animate-pulse"></div>
      <div className="h-4 w-full bg-ui-border rounded-full animate-pulse"></div>
      <div className="h-4 w-5/6 bg-ui-border rounded-full animate-pulse"></div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full bg-ui-border rounded-full animate-pulse"></div>
        <div className="h-3 w-full bg-ui-border rounded-full animate-pulse"></div>
        <div className="h-3 w-4/5 bg-ui-border rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const BeritaPreview = () => {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/berita/latest");
        if (!response.ok) {
          throw new Error("Gagal mengambil data berita");
        }
        const data = await response.json();
        setBeritaList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  return (
    // DIUBAH: Dibuat menjadi full-width dengan padding di kanan-kiri
    <section className="w-full bg-surface-page py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Berita Terbaru
          </h2>
          <Link href="/berita" legacyBehavior>
            <a className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand font-semibold py-2 px-4 sm:px-5 rounded-lg transition-colors duration-200 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page">
              Lihat Semua &rarr;
            </a>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? // Tampilkan skeleton saat loading
              Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : // Tampilkan data berita jika sudah selesai loading
              beritaList.map((berita, index) => (
                <BeritaCard
                  key={berita.news_id}
                  berita={berita}
                  index={index}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default BeritaPreview;
