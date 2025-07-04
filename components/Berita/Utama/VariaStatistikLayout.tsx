// components/Berita/Utama/VariaStatistikLayout.tsx
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import VariaStatistikPageHeader from "./VariaStatistikPageHeader"; // Header yang sudah kita perbaiki

interface VariaStatistikLayoutProps {
  children: React.ReactNode;
}

const VariaStatistikLayout = ({ children }: VariaStatistikLayoutProps) => {
  const router = useRouter();

  // Fungsi ini akan dijalankan saat search bar di header digunakan
  const handleSearch = (query: string) => {
    // Arahkan pengguna ke halaman utama dengan query pencarian
    router.push(`/varia-statistik?keyword=${query}`);
  };

  // Ambil slug kategori dari URL untuk menyorot menu yang aktif
  const { kategori: kategoriSlug } = router.query;

  // Tentukan apakah search bar di header harus disembunyikan
  const hideSearchBar =
    router.pathname !== "/varia-statistik" || !!router.query.keyword;

  return (
    <div className="bg-surface-page flex flex-col min-h-screen">
      <VariaStatistikPageHeader
        onSearch={handleSearch}
        hideSearchBar={hideSearchBar}
        currentCategorySlug={kategoriSlug as string | undefined}
        availableCategories={[]}
      />
      <main className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};

// Helper untuk menerapkan layout ke halaman dengan mudah
export const getVariaStatistikLayout = (page: ReactElement) => {
  return <VariaStatistikLayout>{page}</VariaStatistikLayout>;
};
