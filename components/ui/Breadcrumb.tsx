// components/ui/Breadcrumb.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Mendefinisikan tipe untuk setiap item di dalam breadcrumb
interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Mendefinisikan tipe untuk props utama komponen Breadcrumb
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// Ini adalah definisi komponennya. Hanya ini yang seharusnya ada di file ini.
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                size={16}
                className="mx-2 text-gray-400 flex-shrink-0"
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-semibold text-gray-800 dark:text-gray-200"
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
