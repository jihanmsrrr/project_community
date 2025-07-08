// components/ui/Breadcrumb.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Tipe untuk setiap item di dalam breadcrumb
interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Tipe untuk props utama komponen Breadcrumb
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-1.5 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Tampilkan pemisah jika bukan item pertama */}
            {index > 0 && (
              <ChevronRight
                size={16}
                className="mx-1.5 text-slate-400 dark:text-slate-500 flex-shrink-0"
                aria-hidden="true"
              />
            )}

            {/* Tampilkan sebagai Link jika ada href */}
            {item.href ? (
              <Link
                href={item.href}
                className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              // Tampilkan sebagai teks biasa (dengan highlight) jika ini halaman aktif
              <span
                className="font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/60 dark:bg-sky-900/40 px-2.5 py-1 rounded-md"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
