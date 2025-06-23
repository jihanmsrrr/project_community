// components/VariaStatistik/cards/NewsCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, MessageSquare, Share2 } from "lucide-react";

// LANGKAH 1 & 2: Hapus tipe lokal dan impor tipe yang benar dari sumber tunggal
import type { NewsCardItem } from "@/types/varia";

// Ikon-ikon ini sudah baik
const EyeLucideIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Eye
    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit ${className || ""}`}
    strokeWidth={1.75}
  />
);
const ChatBubbleOvalLeftLucideIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <MessageSquare
    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit ${className || ""}`}
    strokeWidth={1.75}
  />
);
const ShareLucideIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Share2
    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit ${className || ""}`}
    strokeWidth={1.75}
  />
);

const NewsCard: React.FC<{ newsItem: NewsCardItem }> = ({ newsItem }) => {
  const [clientViews, setClientViews] = useState<number | null>(null);
  const [clientComments, setClientComments] = useState<number | null>(null);

  useEffect(() => {
    // Logika ini sudah baik, menggunakan data dari prop jika ada.
    if (newsItem.views == null)
      setClientViews(Math.floor(Math.random() * 250) + 20);
    else setClientViews(newsItem.views);

    if (newsItem.comments == null)
      setClientComments(Math.floor(Math.random() * 30) + 5);
    else setClientComments(newsItem.comments);
  }, [newsItem.views, newsItem.comments]);

  if (!newsItem) return null;

  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 flex flex-col h-full group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Link href={newsItem.link || "#"} className="block w-full h-full">
          <Image
            src={newsItem.imageUrl}
            alt={newsItem.title}
            fill // Gunakan `fill` untuk menggantikan `layout="fill"`
            style={{ objectFit: "cover" }} // Style object-fit
            className="transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              const bgColor = newsItem.categoryBgColor.replace("bg-", "");
              const textColor = newsItem.placeholderTextColor.replace(
                "text-",
                ""
              );
              target.src = `https://placehold.co/400x225/${bgColor}/${textColor}?text=Gagal+Muat`;
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <span
          className={`text-xs font-semibold uppercase ${newsItem.categoryColor} mb-1 tracking-wide`}
        >
          {newsItem.category}
        </span>

        {/* LANGKAH 3: Perbaikan <Link> ke sintaks modern */}
        <Link
          href={newsItem.link || "#"}
          className={`focus:outline-none focus-visible:underline ${newsItem.categoryHoverColor}`}
        >
          <h3
            className={`text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-1.5 leading-tight line-clamp-2 transition-colors`}
          >
            {newsItem.title}
          </h3>
        </Link>

        <p className="text-slate-600 dark:text-slate-400 text-xs mb-3 flex-grow leading-relaxed line-clamp-2 sm:line-clamp-3">
          {newsItem.excerpt}
        </p>
        <div className="mt-auto pt-2 border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 min-w-0">
              {newsItem.authorImageUrl && (
                <Image
                  src={newsItem.authorImageUrl}
                  alt={newsItem.author || "Penulis"}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              )}
              <div className="min-w-0">
                <span className="font-medium text-slate-700 dark:text-slate-200 block truncate max-w-[80px] sm:max-w-[120px] text-[0.7rem] sm:text-xs">
                  {newsItem.author || "Tim Redaksi"}
                </span>

                {/* INI SEKARANG SUDAH BENAR KARENA TIPE DIIMPOR DENGAN BENAR */}
                <span className="text-slate-500 text-[0.7rem] sm:text-xs">
                  {newsItem.displayDate}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
              <div
                className="flex items-center text-slate-500/80 hover:text-blue-600 transition-colors cursor-default"
                title={`Dilihat ${clientViews || 0} kali`}
              >
                <EyeLucideIcon />
                <span className="ml-0.5 sm:ml-1 text-[0.7rem] sm:text-xs">
                  {clientViews !== null ? clientViews : "..."}
                </span>
              </div>
              <div
                className="flex items-center text-slate-500/80 hover:text-blue-600 transition-colors cursor-default"
                title={`${clientComments || 0} Komentar`}
              >
                <ChatBubbleOvalLeftLucideIcon />
                <span className="ml-0.5 sm:ml-1 text-[0.7rem] sm:text-xs">
                  {clientComments !== null ? clientComments : "..."}
                </span>
              </div>
              <button
                className="text-slate-500/80 hover:text-blue-600 transition-colors"
                title="Bagikan"
              >
                <ShareLucideIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
