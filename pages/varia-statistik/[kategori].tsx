// pages/varia-statistik/[kategori].tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import type { ArtikelBerita, NewsCardItem } from "@/types/varia";
import FilterSidebar, {
  FilterValues,
} from "@/components/Berita/TampilBerita/FilterSidebar";
import ResultsGrid from "@/components/Berita/TampilBerita/ResultsGrid";
import VariaStatistikPageHeader from "@/components/Berita/Utama/VariaStatistikPageHeader";
// PageTitle tidak perlu diimpor di sini lagi karena sudah dihandle oleh VariaStatistikPageHeader

// === FUNGSI UTILITAS (SALIN DARI index.tsx) ===
// Penting: Pastikan fungsi ini konsisten di seluruh aplikasi atau pindahkan ke file utilitas terpusat.
interface CategoryStyleProps {
  categoryColor: string;
  categoryBgColor: string;
  categoryHoverColor: string;
  placeholderTextColor: string;
}

const getCategoryColorClasses = (kategori: string): CategoryStyleProps => {
  const kat = kategori.toLowerCase();
  if (kat.includes("bps terkini"))
    return {
      categoryColor: "text-blue-600 dark:text-blue-400",
      categoryBgColor: "bg-blue-500",
      categoryHoverColor: "hover:text-blue-700",
      placeholderTextColor: "text-white",
    };
  if (kat.includes("berita daerah"))
    return {
      categoryColor: "text-green-600 dark:text-green-400",
      categoryBgColor: "bg-green-500",
      categoryHoverColor: "hover:text-green-700",
      placeholderTextColor: "text-white",
    };
  if (kat.includes("fotogenik"))
    return {
      categoryColor: "text-purple-600 dark:text-purple-400",
      categoryBgColor: "bg-purple-500",
      categoryHoverColor: "hover:text-purple-700",
      placeholderTextColor: "text-white",
    };
  if (kat.includes("serba serbi"))
    return {
      categoryColor: "text-yellow-600 dark:text-yellow-400",
      categoryBgColor: "bg-yellow-500",
      categoryHoverColor: "hover:text-yellow-700",
      placeholderTextColor: "text-white",
    };
  if (kat.includes("wisata"))
    // Menggunakan 'wisata' karena URL slugnya 'wisata'
    return {
      categoryColor: "text-pink-600 dark:text-pink-400",
      categoryBgColor: "bg-pink-500",
      categoryHoverColor: "hover:text-pink-700",
      placeholderTextColor: "text-white",
    };
  if (kat.includes("opini"))
    return {
      categoryColor: "text-red-600 dark:text-red-400",
      categoryBgColor: "bg-red-500",
      categoryHoverColor: "hover:text-red-700",
      placeholderTextColor: "text-white",
    };
  return {
    categoryColor: "text-indigo-600 dark:text-indigo-400",
    categoryBgColor: "bg-indigo-500",
    categoryHoverColor: "hover:text-indigo-700",
    placeholderTextColor: "text-white",
  };
};

const mapArtikelToNewsCardItem = (artikel: ArtikelBerita): NewsCardItem => {
  const originalDate = new Date(artikel.savedAt);

  const styles = getCategoryColorClasses(artikel.kategori);
  const safeBgColor = styles.categoryBgColor.replace("bg-", "");
  const safePlaceholderTextColor = styles.placeholderTextColor.replace(
    "text-",
    ""
  );
  const imageUrl =
    artikel.gambarFiles.length > 0 && artikel.gambarFiles[0].url
      ? artikel.gambarFiles[0].url
      : `https://placehold.co/800x500/${safeBgColor}/${safePlaceholderTextColor}?text=${encodeURIComponent(
          artikel.judul
        )}&font=Inter`;
  return {
    id: artikel.id.toString(),
    title: artikel.judul,
    excerpt: artikel.abstrak,
    category: artikel.kategori,
    author: artikel.namaPenulis,
    date: originalDate,
    displayDate: originalDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    link: `/varia-statistik/artikel/${artikel.id}`,
    imageUrl: imageUrl,
    authorImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      artikel.namaPenulis
    )}&background=random&size=32&color=fff&font-size=0.45`,
    views: Math.floor(Math.random() * 250) + 20,
    comments: Math.floor(Math.random() * 30) + 5,
    ...styles,
  };
};

// Fungsi utilitas untuk mengubah slug menjadi nama kategori yang lebih rapi
// Ini juga ada di VariaStatistikPageHeader.tsx, pastikan konsisten.
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
      return "Wisata Statistik"; // Sesuaikan dengan nama di header
    case "opini":
      return "Opini";
    default:
      return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

export default function KategoriPage() {
  const router = useRouter();
  const { kategori: kategoriSlug } = router.query; // Ambil slug kategori dari URL

  const [isLoading, setIsLoading] = useState(true);
  const [allArticles, setAllArticles] = useState<NewsCardItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    keyword: "",
    kategori: "", // Ini akan diisi dari URL saat komponen mount
    penulis: "",
    urutkan: "terbaru",
    tanggalMulai: null,
    tanggalSelesai: null,
  });

  // Effect untuk mengambil data artikel dari API
  useEffect(() => {
    const fetchAllArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/berita");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data: ArtikelBerita[] = await response.json();
        setAllArticles(data.map(mapArtikelToNewsCardItem));
      } catch (error) {
        console.error("Gagal mengambil data berita:", error);
      }
      setIsLoading(false);
    };
    fetchAllArticles();
  }, []);

  // Effect untuk mengatur filter awal berdasarkan URL kategori
  useEffect(() => {
    if (router.isReady && kategoriSlug) {
      const categoryName = slugToCategoryName(kategoriSlug as string); // Ubah slug menjadi nama kategori yang benar
      setActiveFilters((prev) => ({
        ...prev,
        kategori: categoryName,
        // Set keyword dari URL jika ada
        keyword: (router.query.keyword as string) || "",
      }));
    } else if (router.isReady && !kategoriSlug) {
      // Ini penting jika pengguna menghapus kategori dari URL secara manual
      // atau jika kita ingin halaman ini bisa berfungsi tanpa kategori spesifik
      setActiveFilters((prev) => ({
        ...prev,
        kategori: "",
        keyword: (router.query.keyword as string) || "",
      }));
    }
  }, [router.isReady, kategoriSlug, router.query.keyword]);

  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set(allArticles.map((a) => a.category));
    return Array.from(categoriesSet);
  }, [allArticles]);

  const uniqueAuthors = useMemo(() => {
    const authorsSet = new Set(allArticles.map((a) => a.author));
    return Array.from(authorsSet);
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    let results = [...allArticles];
    const {
      keyword,
      kategori, // Kategori ini sudah merupakan nama yang benar dari `activeFilters`
      penulis,
      urutkan,
      tanggalMulai,
      tanggalSelesai,
    } = activeFilters;

    // Filter berdasarkan kategori yang aktif
    if (kategori) {
      results = results.filter((a) => a.category === kategori);
    }

    // Filter berdasarkan kata kunci
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerKeyword) ||
          a.excerpt.toLowerCase().includes(lowerKeyword)
      );
    }

    // Filter berdasarkan penulis
    if (penulis) {
      results = results.filter((a) => a.author === penulis);
    }

    // Filter berdasarkan rentang tanggal
    if (tanggalMulai && tanggalSelesai) {
      const startTime = new Date(tanggalMulai).setHours(0, 0, 0, 0);
      const endTime = new Date(tanggalSelesai).setHours(23, 59, 59, 999);
      results = results.filter((a) => {
        const articleTime = a.date.getTime();
        return articleTime >= startTime && articleTime <= endTime;
      });
    }

    // Urutkan hasil
    results.sort((a, b) => {
      if (urutkan === "judul") return a.title.localeCompare(b.title);
      return b.date.getTime() - a.date.getTime();
    });

    return results;
  }, [allArticles, activeFilters]);

  // Fungsi untuk menangani perubahan filter dari sidebar
  const handleFilterChange = (newFilters: FilterValues) => {
    setActiveFilters(newFilters);

    // Update URL berdasarkan perubahan filter
    const newQuery: { [key: string]: string | undefined } = {};
    if (newFilters.keyword) {
      newQuery.keyword = newFilters.keyword;
    }

    let targetPath = `/varia-statistik`;

    if (newFilters.kategori) {
      // Jika kategori dipilih, arahkan ke URL kategori baru
      targetPath = `/varia-statistik/${newFilters.kategori
        .toLowerCase()
        .replace(/\s/g, "-")}`;
    }

    // Push ke URL baru dengan query yang diperbarui
    router.push(
      {
        pathname: targetPath,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  // Fungsi untuk mereset semua filter
  const handleReset = () => {
    const resetFilters: FilterValues = {
      keyword: "",
      kategori: "",
      penulis: "",
      urutkan: "terbaru",
      tanggalMulai: null,
      tanggalSelesai: null,
    };
    setActiveFilters(resetFilters);
    router.push("/varia-statistik"); // Kembali ke halaman utama varia statistik
  };

  return (
    <div className="bg-surface-page flex flex-col min-h-screen">
      {/* VariaStatistikPageHeader akan menangani tampilan header atas (judul, menu kategori, dan background) */}
      <VariaStatistikPageHeader
        // onSearch di sini tidak digunakan karena FilterSidebar yang menangani perubahan keyword
        // Parameter 'query' dihapus karena tidak digunakan.
        onSearch={() => {
          /* no-op */
        }}
        hideSearchBar={true} // Sembunyikan search bar di header karena FilterSidebar akan menampilkannya
      />

      <main className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            initialKeyword={activeFilters.keyword}
            categories={uniqueCategories}
            authors={uniqueAuthors}
            initialCategory={activeFilters.kategori} // Set initial category filter
          />
          <ResultsGrid
            articles={filteredArticles}
            isLoading={isLoading}
            keyword={activeFilters.keyword}
            category={activeFilters.kategori} // Pass active category to ResultsGrid for display
          />
        </div>
      </main>
    </div>
  );
}
