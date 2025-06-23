// components/Berita/TampilBerita/ResultsGrid.tsx
// (asumsi kode yang sudah ada, hanya menambahkan props dan penggunaan)
"use client";

import React from "react";
import NewsCard from "@/components/Berita/Card/NewsCard";
import Skeleton from "@/components/ui/Skeleton";
import type { NewsCardItem } from "@/types/varia";

interface ResultsGridProps {
  articles: NewsCardItem[];
  isLoading: boolean;
  keyword: string;
  category?: string; // Tambahkan prop ini
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  articles,
  isLoading,
  keyword,
  category, // Terima prop ini
}) => {
  const displayTitle = keyword
    ? `Hasil Pencarian: "${keyword}"`
    : category && category !== "Semua Kategori"
    ? `Artikel Kategori: "${category}"`
    : "Semua Artikel";

  return (
    <div className="md:col-span-8 lg:col-span-9">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {displayTitle}
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="h-60" radius="rounded-xl" />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <NewsCard key={item.id} newsItem={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg py-10">
          Tidak ada artikel yang ditemukan untuk {keyword ? `"${keyword}"` : ""}{" "}
          {category && category !== "Semua Kategori"
            ? `di kategori "${category}"`
            : ""}
          .
        </p>
      )}
    </div>
  );
};

export default ResultsGrid;
