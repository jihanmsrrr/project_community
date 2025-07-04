// components/Berita/Utama/VariaStatistikLayout.tsx
import React, { ReactElement, useState, useEffect } from "react";
import { useRouter } from "next/router";
import VariaStatistikPageHeader from "./VariaStatistikPageHeader";

interface VariaStatistikLayoutProps {
  children: React.ReactNode;
}

const VariaStatistikLayout = ({ children }: VariaStatistikLayoutProps) => {
  const router = useRouter();
  // --- PERBAIKAN: Layout sekarang punya state untuk menyimpan kategori menu ---
  const [menuCategories, setMenuCategories] = useState<string[]>([]);

  // --- PERBAIKAN: Layout yang mengambil data menu, bukan header ---
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch("/api/berita/meta");
        if (!response.ok) throw new Error("Gagal mengambil data menu");
        const data = await response.json();
        if (data && Array.isArray(data.categories)) {
          setMenuCategories(data.categories);
        }
      } catch (error) {
        console.error("Gagal memuat kategori untuk layout:", error);
      }
    };
    fetchMenuData();
  }, []); // Hanya dijalankan sekali

  const handleSearch = (query: string) => {
    router.push(`/varia-statistik?keyword=${query}`);
  };

  const { kategori: kategoriSlug } = router.query;
  const hideSearchBar =
    router.pathname !== "/varia-statistik" || !!router.query.keyword;

  return (
    <div className="bg-surface-page flex flex-col min-h-screen">
      <VariaStatistikPageHeader
        onSearch={handleSearch}
        hideSearchBar={hideSearchBar}
        // --- PERBAIKAN: Teruskan data menu ke header ---
        availableCategories={menuCategories}
        currentCategorySlug={kategoriSlug as string | undefined}
      />
      <main className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};

export const getVariaStatistikLayout = (page: ReactElement) => {
  return <VariaStatistikLayout>{page}</VariaStatistikLayout>;
};
