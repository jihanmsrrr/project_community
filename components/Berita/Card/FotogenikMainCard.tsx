// /components/Berita/Card/FotogenikMainCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { NewsCardItem } from "@/types/varia";

const FotogenikMainCard: React.FC<{ newsItem: NewsCardItem }> = ({
  newsItem,
}) => {
  if (!newsItem || !newsItem.link) return null;

  const isPlaceholder = newsItem.imageUrl.includes("placehold.co");

  return (
    // FIX 2: Memperbarui <Link> ke sintaks modern
    <Link
      href={newsItem.link}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 ease-in-out group h-full flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400"
    >
      {/* Area Gambar atau Teks Judul */}
      <div
        className={`w-full relative aspect-[4/3] flex items-center justify-center overflow-hidden ${
          isPlaceholder ? newsItem.categoryBgColor : ""
        }`}
      >
        {isPlaceholder ? (
          <h2
            className={`text-xl sm:text-2xl font-bold ${newsItem.placeholderTextColor} text-center break-words p-4`}
          >
            {newsItem.title.length < 30 ? newsItem.title : newsItem.category}
          </h2>
        ) : (
          // FIX 3: (Opsional) Memperbarui <Image> ke sintaks modern
          <Image
            src={newsItem.imageUrl}
            alt={newsItem.title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/600x450/f472b6/FFFFFF?text=Error&font=Inter";
            }}
          />
        )}
      </div>

      {/* Area Konten Teks */}
      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        <span
          className={`text-xs font-semibold uppercase ${newsItem.categoryColor} mb-1 tracking-wider`}
        >
          {newsItem.category}
        </span>
        <h4
          className={`font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-1 leading-tight line-clamp-2 transition-colors ${newsItem.categoryHoverColor} group-hover:text-inherit`}
        >
          {newsItem.title}
        </h4>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2 border-t border-gray-200 dark:border-slate-700">
          {newsItem.author && (
            <span className="block truncate">Oleh: {newsItem.author}</span>
          )}
          {/* FIX 1: Mengganti .date menjadi .displayDate */}
          <span>{newsItem.displayDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default FotogenikMainCard;
