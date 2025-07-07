// components/Berita/Utama/HeroDisplay.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import type { NewsCardItem } from "@/types/varia"; // Pastikan imageUrl di NewsCardItem adalah string | null | undefined

const IconWrapper: React.FC<{
  IconComponent: React.ElementType;
  className?: string;
  strokeWidth?: number;
}> = ({ IconComponent, className, strokeWidth = 1.75 }) => (
  <IconComponent
    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit ${className || ""}`}
    strokeWidth={strokeWidth}
  />
);

const HeroDisplay: React.FC<{
  newsItem: NewsCardItem | null;
  loading: boolean;
}> = ({ newsItem, loading }) => {
  if (loading) {
    return (
      <Skeleton
        height="h-[45vh] sm:h-[55vh] md:h-[65vh]"
        radius="rounded-2xl"
      />
    );
  }

  if (!newsItem) {
    return (
      <div className="aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 italic shadow-inner">
        Berita utama tidak tersedia saat ini.
      </div>
    );
  }

  // --- PERBAIKAN: Pastikan URL gambar selalu valid atau undefined ---
  const imageUrlToUse =
    newsItem.imageUrl &&
    typeof newsItem.imageUrl === "string" &&
    newsItem.imageUrl !== ""
      ? newsItem.imageUrl
      : "/images/image-placeholder.png"; // Fallback ke gambar placeholder umum yang valid
  // --- AKHIR PERBAIKAN ---

  return (
    <article className="relative w-full h-auto aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] rounded-2xl overflow-hidden shadow-2xl group focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
      <Link
        href={newsItem.link || "#"}
        className="block w-full h-full relative"
      >
        <Image
          src={imageUrlToUse} // Menggunakan URL yang sudah diproses
          alt={newsItem.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 ease-in-out group-hover:scale-105"
          priority
          // onError handler ini bisa dihapus atau disesuaikan, karena src sudah memiliki fallback
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/images/image-placeholder.png"; // Pastikan ini juga menunjuk ke path valid
          }}
          sizes="(min-width: 1024px) 80vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 z-20">
          <span
            className={`inline-block text-xs font-semibold uppercase py-1 px-3 rounded-full mb-2 sm:mb-3 ${newsItem.categoryBgColor} ${newsItem.placeholderTextColor} tracking-wider`}
          >
            {newsItem.category}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white hover:text-gray-200 transition-colors mb-2 leading-tight line-clamp-2 sm:line-clamp-3">
            {newsItem.title}
          </h1>

          <div className="flex items-center text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
            <span className="font-medium">Oleh {newsItem.author}</span>
            <span className="mx-2">&bull;</span>
            <span>{newsItem.displayDate}</span>
          </div>

          <p className="text-gray-200 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 hidden md:block">
            {newsItem.excerpt}
          </p>
          <div className="text-white hover:underline font-semibold text-sm sm:text-base flex items-center self-start transition-colors">
            Baca Selengkapnya
            <IconWrapper
              IconComponent={ChevronRight}
              className="ml-1 w-5 h-5"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default HeroDisplay;
