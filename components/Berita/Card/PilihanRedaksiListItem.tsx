// components/Berita/Card/PilihanRedaksiListItem.tsx
"use client";

import React from "react";
import Link from "next/link";
import type { NewsCardItem } from "@/types/varia";

// Add `isNewest` prop
const PilihanRedaksiListItem: React.FC<{
  item: NewsCardItem;
  isNewest?: boolean;
}> = ({ item, isNewest }) => {
  if (!item) return null;

  return (
    <li className="py-3 sm:py-3.5 border-b border-gray-200 dark:border-slate-700 last:border-b-0 relative">
      {" "}
      {/* Added relative */}
      {isNewest && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full rotate-6 animate-pulse z-10">
          BARU!
        </span>
      )}
      <Link
        href={item.link}
        className="block group focus:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-slate-700 rounded-md p-1 -m-1"
      >
        <h4
          className={`font-semibold text-sm text-gray-700 dark:text-gray-200 mb-0.5 leading-snug line-clamp-2 transition-colors ${item.categoryHoverColor} group-hover:text-inherit`}
        >
          {item.title}
        </h4>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          {item.author && (
            <span className="truncate max-w-[150px] sm:max-w-[200px] inline-flex items-center">
              Oleh: {item.author}
              <span className="mx-1.5">&bull;</span>
            </span>
          )}
          <span>{item.displayDate}</span>
        </div>
      </Link>
    </li>
  );
};

export default PilihanRedaksiListItem;
