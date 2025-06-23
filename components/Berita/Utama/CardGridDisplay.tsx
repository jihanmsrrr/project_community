// /components/Berita/Utama/CardGridDisplay.tsx
"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";
import type { NewsCardItem } from "@/types/varia";

interface CardGridDisplayProps {
  items?: NewsCardItem[];
  CardComponent: React.FC<{ newsItem: NewsCardItem }>;
  gridClasses?: string;
  skeletonHeight?: string;
  loading?: boolean;
  skeletonCount?: number;
}

const CardGridDisplay: React.FC<CardGridDisplayProps> = ({
  items,
  CardComponent,
  gridClasses = "sm:grid-cols-2 lg:grid-cols-3",
  skeletonHeight = "h-96",
  loading = false,
  skeletonCount = 3,
}) => {
  // 1. Tampilkan Skeleton saat loading
  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 ${gridClasses} gap-5 sm:gap-6 md:gap-8`}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} height={skeletonHeight} radius="rounded-xl" />
        ))}
      </div>
    );
  }

  // 2. Tampilkan pesan jika data tidak ada setelah loading selesai
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center italic py-10 bg-white dark:bg-slate-800 rounded-xl shadow">
        <p className="text-lg">Konten untuk bagian ini belum tersedia.</p>
        <p className="text-sm mt-1">Silakan cek kembali nanti.</p>
      </div>
    );
  }

  // 3. Tampilkan grid kartu jika data ada
  return (
    <div className={`grid grid-cols-1 ${gridClasses} gap-5 sm:gap-6 md:gap-8`}>
      {items.map((item) => (
        <CardComponent key={item.id} newsItem={item} />
      ))}
    </div>
  );
};

export default CardGridDisplay;
