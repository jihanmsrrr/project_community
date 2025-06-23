// components/dashboard/NewsFeedCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Tipe data untuk item berita
interface NewsItem {
  id: string | number;
  title: string;
  snippet: string;
  date: string;
  author?: string;
  authorAvatar?: string;
  link?: string;
  source?: string;
}

interface NewsFeedCardProps {
  newsItems?: NewsItem[]; // 👈 Prop baru untuk menerima data berita
}

const NewsFeedCard: React.FC<NewsFeedCardProps> = ({ newsItems = [] }) => {
  // 👈 Terima prop newsItems, default ke array kosong
  const newsItemsToDisplay = newsItems.slice(0, 5); // Tampilkan N berita teratas dari prop

  return (
    <div className="bg-surface-card dark:bg-surface-card-dark rounded-xl shadow-lg p-4 sm:p-5 h-full flex flex-col">
      <h3
        id="news-feed-title" // 👈 ID untuk aria-labelledby di StatsRow
        className="text-base sm:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-3 sm:mb-4 border-b border-ui-border dark:border-ui-border-dark pb-2.5" // Sedikit padding bawah
      >
        Berita & Aktivitas Terkini
      </h3>
      {newsItemsToDisplay.length === 0 ? (
        <div className="flex-grow flex items-center justify-center py-8">
          {" "}
          {/* Tambah padding jika kosong */}
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Tidak ada berita untuk wilayah ini.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 sm:space-y-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-ui-border dark:scrollbar-thumb-ui-border-dark scrollbar-track-surface-page dark:scrollbar-track-surface-page-dark scrollbar-thumb-rounded-full pr-1.5">
          {" "}
          {/* Sedikit pr untuk scrollbar */}
          {newsItemsToDisplay.map((item) => (
            <li key={item.id} className="p-0.5">
              {" "}
              {/* Key tetap di sini */}
              <Link href={item.link || "#"} legacyBehavior>
                <a className="block p-2.5 rounded-lg hover:bg-surface-page dark:hover:bg-surface-page-dark focus:bg-surface-page dark:focus:bg-surface-page-dark focus:outline-none focus:ring-1 focus:ring-brand-focus transition-colors duration-150 group">
                  <div className="flex items-start gap-3">
                    {item.authorAvatar && (
                      <Image
                        src={item.authorAvatar}
                        alt={item.author || "Avatar"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover mt-0.5 flex-shrink-0"
                      />
                    )}
                    {!item.authorAvatar && item.source && (
                      <div className="w-9 h-9 bg-brand-accent/20 text-brand-accent dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                        {item.source.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    {/* Fallback jika tidak ada avatar dan source, tapi ada author */}
                    {!item.authorAvatar && !item.source && item.author && (
                      <div className="w-9 h-9 bg-ui-fill dark:bg-ui-fill-dark text-text-secondary dark:text-text-secondary-dark rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                        {item.author.substring(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-text-primary dark:text-text-primary-dark group-hover:text-brand-primary dark:group-hover:text-brand-primary-dark line-clamp-2 break-words mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[0.7rem] sm:text-xs text-text-secondary dark:text-text-secondary-dark line-clamp-2 break-words mb-1">
                        {item.snippet}
                      </p>
                      <div className="flex items-center justify-between text-[0.65rem] sm:text-xs text-text-disabled dark:text-text-disabled-dark">
                        {" "}
                        {/* Warna lebih muted */}
                        <span>{item.author || item.source || "BPS"}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {/* Tampilkan link "Lihat Semua" jika total berita yang diterima lebih banyak dari yang ditampilkan */}
      {newsItems.length > newsItemsToDisplay.length && (
        <div className="mt-3 pt-3 border-t border-ui-border dark:border-ui-border-dark text-center">
          <Link href="/berita" legacyBehavior>
            {" "}
            {/* Ganti dengan link halaman semua berita yang benar */}
            <a className="text-xs sm:text-sm font-medium text-brand-primary dark:text-brand-primary-dark hover:text-brand-primary-hover dark:hover:text-brand-primary-hover-dark hover:underline">
              Lihat Semua Berita...
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsFeedCard;
