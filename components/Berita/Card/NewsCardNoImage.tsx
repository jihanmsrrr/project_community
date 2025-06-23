// components/Berita/Card/NewsCardNoImage.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { NewsCardItem } from "@/types/varia";

const NewsCardNoImage: React.FC<{ newsItem: NewsCardItem }> = ({
  newsItem,
}) => {
  return (
    <Link
      href={newsItem.link}
      className="block bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 p-5" // Added padding here
      style={{ height: "100%" }}
    >
      <div className="flex flex-col flex-grow">
        <span
          className={`text-xs font-semibold uppercase ${newsItem.categoryColor} mb-2 tracking-wider`}
        >
          {newsItem.category}
        </span>
        <h3
          className={`text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 leading-tight line-clamp-4 transition-colors ${newsItem.categoryHoverColor} group-hover:text-inherit`}
        >
          {newsItem.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-5 flex-grow">
          {newsItem.excerpt}
        </p>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Image
            src={newsItem.authorImageUrl}
            alt={newsItem.author}
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">
              {newsItem.author}
            </p>
            <p className="text-xs">{newsItem.displayDate}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCardNoImage;
