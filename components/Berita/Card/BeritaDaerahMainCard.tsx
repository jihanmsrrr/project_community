// components/Berita/Card/BeritaDaerahMainCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// Tipe diimpor dengan benar dari sumber terpusat
import type { NewsCardItem } from "@/types/varia"; // Pastikan imageUrl & authorImageUrl di NewsCardItem adalah string | null | undefined

const BeritaDaerahMainCard: React.FC<{ newsItem: NewsCardItem | null }> = ({
  newsItem,
}) => {
  if (!newsItem || !newsItem.link) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 text-center text-gray-500 dark:text-gray-400 italic">
        Berita daerah utama tidak tersedia.
      </div>
    );
  }

  // --- PERBAIKAN: Pastikan URL gambar selalu valid atau undefined ---
  const imageUrlToUse =
    newsItem.imageUrl &&
    typeof newsItem.imageUrl === "string" &&
    newsItem.imageUrl !== ""
      ? newsItem.imageUrl
      : "/images/image-placeholder.png"; // Fallback ke gambar placeholder umum

  const authorImageUrlToUse =
    newsItem.authorImageUrl &&
    typeof newsItem.authorImageUrl === "string" &&
    newsItem.authorImageUrl !== ""
      ? newsItem.authorImageUrl
      : "/images/default-avatar.png"; // Fallback ke gambar placeholder avatar
  // --- AKHIR PERBAIKAN ---

  return (
    <Link
      href={newsItem.link}
      className="block bg-white dark:bg-slate-800 rounded-xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 ease-in-out group md:flex h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400"
    >
      {/* Kolom Gambar */}
      <div className="md:w-2/5 lg:w-1/2 relative aspect-[16/9] md:aspect-auto overflow-hidden">
        <Image
          src={imageUrlToUse} // Menggunakan URL yang sudah diproses
          alt={newsItem.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 45vw"
          // Error handler ini bisa dihapus jika sudah ada fallback src
          // onError={(e) => {
          //   (
          //     e.target as HTMLImageElement
          //   ).src = `https://placehold.co/800x500/16a34a/FFFFFF?text=Gagal+Muat&font=Inter`;
          // }}
        />
      </div>

      {/* Kolom Konten Teks */}
      <div className="p-5 sm:p-6 md:p-8 md:w-3/5 lg:w-1/2 flex flex-col justify-center">
        <span
          className={`text-xs font-semibold uppercase ${newsItem.categoryColor} mb-2 tracking-wider`}
        >
          {newsItem.category}
        </span>
        <h3
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight line-clamp-3 transition-colors ${newsItem.categoryHoverColor} group-hover:text-inherit`}
        >
          {newsItem.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4 md:mb-5 leading-relaxed line-clamp-3 md:line-clamp-4 flex-grow">
          {newsItem.excerpt}
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Image
              src={authorImageUrlToUse} // Menggunakan URL yang sudah diproses
              alt={newsItem.author}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                {newsItem.author}
              </p>
              <p className="text-sm">{newsItem.displayDate}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BeritaDaerahMainCard;
