// components/Berita/Utama/VariaStatistikPageHeader.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Menu as MenuIconLucide, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PageTitle from "@/components/ui/PageTitle";
import { useRouter } from "next/router";
// import { usePathname } from "next/navigation"; // <--- Hapus atau komen ini jika Anda tidak menggunakan App Router (Next.js 13+)

// Fungsi utilitas untuk mengubah slug menjadi nama kategori yang lebih rapi
// Penting: Pastikan ini KONSISTEN dengan yang di pages/varia-statistik/[kategori].tsx
const slugToCategoryName = (slug: string): string => {
  switch (slug) {
    case "bps-terkini":
      return "Berita Terkini";
    case "berita-daerah":
      return "Berita Daerah";
    case "fotogenik":
      return "Fotogenik";
    case "serba-serbi":
      return "Serba Serbi";
    case "wisata":
      return "Wisata Statistik";
    case "opini":
      return "Opini";
    default:
      return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

// Interface props untuk komponen ini
interface VariaStatistikPageHeaderProps {
  onSearch: (query: string) => void;
  hideSearchBar?: boolean;
  // Prop untuk memberikan judul kustom jika diperlukan, misal untuk halaman utama
  dynamicTitle?: string;
}

const VariaStatistikPageHeader: React.FC<VariaStatistikPageHeaderProps> = ({
  onSearch,
  hideSearchBar = false,
  dynamicTitle, // Terima prop dynamicTitle
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  // Ambil kategoriSlug dari router.query. Ini akan ada jika URLnya /varia-statistik/[kategori] atau /varia-statistik/artikel/[id]
  const { kategori: kategoriSlug, id: articleId } = router.query;
  const currentAsPath = router.asPath; // Menggunakan asPath untuk URL lengkap (termasuk query params)

  // Fungsi ini dipanggil saat form search di header disubmit
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm); // Panggil fungsi onSearch dari parent (VariaStatistikPage atau KategoriPage)
  };

  const categoryMenuButtonBaseStyle =
    "py-2 px-3 sm:px-4 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-card-dark focus-visible:ring-brand-focus dark:focus-visible:ring-brand-focus-dark";

  const categoryMenuButtonStyle = `${categoryMenuButtonBaseStyle} 
    bg-surface-button-secondary dark:bg-surface-button-secondary-dark 
    text-text-on-button-secondary dark:text-text-on-button-secondary-dark 
    hover:bg-surface-button-secondary-hover dark:hover:bg-surface-button-secondary-hover-dark 
    shadow-sm`;

  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg text-primary font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  // Logika untuk menentukan judul halaman
  const headerPageTitle = useMemo(() => {
    if (dynamicTitle) {
      return dynamicTitle;
    }
    // Jika di halaman kategori atau artikel, gunakan kategoriSlug
    if (kategoriSlug) {
      return `Varia Statistik: ${slugToCategoryName(kategoriSlug as string)}`;
    }
    // Jika di halaman artikel tanpa kategoriSlug di URL (jarang, tapi mungkin)
    if (articleId) {
      return `Varia Statistik: Artikel`; // Atau bisa ambil dari data artikel jika ada
    }
    // Default untuk halaman utama Varia Statistik
    return "Varia Statistik BPS";
  }, [dynamicTitle, kategoriSlug, articleId]);

  return (
    <header className="bg-surface-page flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4 text-center">
          <PageTitle title={headerPageTitle} backgroundImage="/title.png" />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center py-3 sm:py-4">
            {[
              { label: "Berita Terkini", path: "/varia-statistik/bps-terkini" },
              {
                label: "Berita Daerah",
                path: "/varia-statistik/berita-daerah",
              },
              { label: "Fotogenik", path: "/varia-statistik/fotogenik" },
              { label: "Serba Serbi", path: "/varia-statistik/serba-serbi" },
              { label: "Wisata Statistik", path: "/varia-statistik/wisata" },
              { label: "Opini", path: "/varia-statistik/opini" },
            ].map((item) => {
              // Logika isActive yang LEBIH cerdas dan aman
              let isActive = false;
              const itemPathBase = item.path.split("?")[0]; // Ambil path tanpa query

              // 1. Exact match (untuk halaman kategori langsung)
              if (currentAsPath === itemPathBase) {
                isActive = true;
              }
              // 2. Jika di halaman artikel dan kategori artikelnya cocok
              else if (
                currentAsPath.startsWith("/varia-statistik/artikel/") &&
                kategoriSlug
              ) {
                // Konversi item.path ke slug untuk perbandingan yang konsisten
                const itemSlug = itemPathBase.split("/").pop(); // Ambil bagian terakhir dari path (slug)
                if (itemSlug === kategoriSlug) {
                  isActive = true;
                }
              }
              // 3. Jika di halaman utama /varia-statistik dan item adalah "Varia Statistik" itu sendiri
              else if (
                item.path === "/varia-statistik" &&
                (currentAsPath === "/varia-statistik" ||
                  currentAsPath.startsWith("/varia-statistik?"))
              ) {
                isActive = true;
              }

              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`${menuButtonBaseStyle} 
                    ${
                      isActive
                        ? "bg-[#adcbe3] dark:bg-[#8ab6d6] font-semibold shadow-md ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-blue-500 dark:ring-sky-400"
                        : "bg-[#e0eaf4] dark:bg-slate-700 font-medium hover:bg-[#d0ddeb] dark:hover:bg-slate-600 shadow-sm"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="md:hidden flex justify-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`${categoryMenuButtonStyle} w-full max-w-xs mx-auto flex items-center justify-center gap-2`}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-category-menu-varia"
        >
          <MenuIconLucide className="w-5 h-5" />
          <span>Pilih Kategori</span>
          <ChevronDown
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              isMobileMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-category-menu-varia"
            className="md:hidden bg-surface-card dark:bg-surface-card-dark shadow-lg -mt-px mx-0 rounded-b-md absolute w-full left-0 z-20 border-t border-ui-border dark:border-ui-border-dark"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          ></motion.div>
        )}
      </AnimatePresence>
      {/* Kondisional render search bar */}
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
