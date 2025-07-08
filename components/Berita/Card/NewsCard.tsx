// components/Berita/Card/NewsCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, MessageSquare, Share2 } from "lucide-react";
import type { NewsCardItem } from "@/types/varia"; // Pastikan imageUrl & authorImageUrl di NewsCardItem adalah string | null | undefined

const IconWrapper: React.FC<{
  IconComponent: React.ElementType;
  className?: string;
}> = ({ IconComponent, className }) => (
  <IconComponent
    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit ${className || ""}`}
    strokeWidth={1.75}
  />
);

const NewsCard: React.FC<{ newsItem: NewsCardItem }> = ({ newsItem }) => {
  // --- PERBAIKAN: Pastikan URL gambar selalu valid atau undefined ---
  const imageUrlToUse =
    newsItem.imageUrl &&
    typeof newsItem.imageUrl === "string" &&
    newsItem.imageUrl !== ""
      ? newsItem.imageUrl
      : "/image.png"; // Fallback ke gambar placeholder umum yang valid

  const authorImageUrlToUse =
    newsItem.authorImageUrl &&
    typeof newsItem.authorImageUrl === "string" &&
    newsItem.authorImageUrl !== ""
      ? newsItem.authorImageUrl
      : "/images/default-avatar.png"; // Fallback ke gambar placeholder avatar
  // --- AKHIR PERBAIKAN ---

  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-full group">
      <Link href={newsItem.link} legacyBehavior>
        <a className="block relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrlToUse} // Menggunakan URL yang sudah diproses
            alt={newsItem.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            // onError handler ini bisa dihapus atau disesuaikan, karena src sudah memiliki fallback
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/image.png"; // Pastikan ini juga menunjuk ke path valid
            }}
          />
        </a>
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <span
          className={`text-xs font-semibold uppercase ${newsItem.categoryColor} mb-1.5 tracking-wider`}
        >
          {newsItem.category}
        </span>
        <Link href={newsItem.link} legacyBehavior>
          <a
            className={`focus:outline-none focus-visible:underline ${newsItem.categoryHoverColor}`}
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 leading-tight line-clamp-2 transition-colors group-hover:text-inherit">
              {newsItem.title}
            </h3>
          </a>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow leading-relaxed line-clamp-3">
          {newsItem.excerpt}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src={authorImageUrlToUse} // Menggunakan URL yang sudah diproses
                alt={newsItem.author}
                width={28}
                height={28}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="font-medium text-gray-700 dark:text-gray-200 block truncate text-xs">
                  {newsItem.author}
                </span>
                <span className="text-xs">{newsItem.displayDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {[
                { Icon: Eye, value: newsItem.views, title: "Dilihat" },
                {
                  Icon: MessageSquare,
                  value: newsItem.comments,
                  title: "Komentar",
                },
              ].map((stat) => (
                <div
                  key={stat.title}
                  className="flex items-center"
                  title={`${stat.title} ${stat.value || 0} kali`}
                >
                  <IconWrapper IconComponent={stat.Icon} />
                  <span className="ml-1 text-xs">{stat.value || 0}</span>
                </div>
              ))}
              <button title="Bagikan">
                <IconWrapper IconComponent={Share2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
