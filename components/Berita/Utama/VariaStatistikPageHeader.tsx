// components/Berita/Utama/VariaStatistikPageHeader.tsx
"use client";

import React, { useState, useMemo } from "react";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";

interface MenuItem {
  label: string;
  slug: string;
  path: string;
}

const categoryToSlug = (categoryName: string): string => {
  if (!categoryName) return "";
  return categoryName.toLowerCase().replace(/\s+/g, "-");
};

interface VariaStatistikPageHeaderProps {
  onSearch: (query: string) => void;
  hideSearchBar?: boolean;
  // --- PERBAIKAN: Menerima daftar kategori dari parent (Layout) ---
  availableCategories: string[];
  currentCategorySlug?: string;
}

const VariaStatistikPageHeader: React.FC<VariaStatistikPageHeaderProps> = ({
  onSearch,
  hideSearchBar = false,
  availableCategories = [], // Default ke array kosong agar aman
  currentCategorySlug,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // --- DIHAPUS: useEffect untuk fetch data dipindahkan ke Layout ---

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const menuItems: MenuItem[] = useMemo(() => {
    return availableCategories.map((cat) => ({
      label: cat,
      slug: categoryToSlug(cat),
      path: `/varia-statistik/${categoryToSlug(cat)}`,
    }));
  }, [availableCategories]);

  const headerPageTitle = useMemo(() => {
    const activeMenuItem = menuItems.find(
      (item) => item.slug === currentCategorySlug
    );
    return activeMenuItem
      ? `Varia Statistik: ${activeMenuItem.label}`
      : "Varia Statistik BPS";
  }, [currentCategorySlug, menuItems]);

  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  return (
    <header className="bg-surface-page flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4 text-center">
          <PageTitle title={headerPageTitle} backgroundImage="/title.png" />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-0 md:top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center py-3 sm:py-4">
            {menuItems.map((item) => {
              const isActive = item.slug === currentCategorySlug;
              return (
                <Link key={item.label} href={item.path} legacyBehavior>
                  <a
                    className={`${menuButtonBaseStyle} ${
                      isActive
                        ? "bg-[#adcbe3] dark:bg-[#8ab6d6] font-semibold shadow-md ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-blue-500 dark:ring-sky-400"
                        : "bg-[#e0eaf4] dark:bg-slate-700 font-medium hover:bg-[#d0ddeb] dark:hover:bg-slate-600 shadow-sm"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {!hideSearchBar && (
        <div className="bg-surface-page py-6 sm:py-8">
          <div className="max-w-xl mx-auto px-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-surface-card dark:bg-surface-card-dark rounded-xl shadow-lg overflow-hidden border border-ui-border dark:border-ui-border-dark"
            >
              <input
                type="search"
                name="searchQueryVaria"
                placeholder="Cari artikel di Varia Statistik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3.5 text-base text-text-primary dark:text-text-primary-dark bg-transparent placeholder-text-placeholder dark:placeholder-text-placeholder-dark focus:outline-none focus:ring-2 focus:ring-brand-focus dark:focus:ring-brand-focus-dark focus:ring-inset"
              />
              <button
                type="submit"
                aria-label="Cari Artikel"
                className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-6 sm:px-8 py-3.5 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-focus"
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default VariaStatistikPageHeader;
