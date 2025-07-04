// pages/varia-statistik/[kategori].tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { ArtikelBerita, NewsCardItem } from "@/types/varia";
import FilterSidebar, {
  FilterValues,
} from "@/components/Berita/TampilBerita/FilterSidebar";
import ResultsGrid from "@/components/Berita/TampilBerita/ResultsGrid";
import PageTitle from "@/components/ui/PageTitle";
import { ArrowLeft } from "lucide-react";

// --- FUNGSI UTILITAS ---
// Sebaiknya, pindahkan fungsi-fungsi ini ke file terpusat seperti `lib/utils.ts`
const getCategoryColorClasses = (kategori: string) => {
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

  const gambarUrls = artikel.gambar_urls as { url: string }[] | null;
  const imageUrl =
    gambarUrls && gambarUrls.length > 0
      ? gambarUrls[0].url
      : `https://placehold.co/800x500/${safeBgColor}/${safePlaceholderTextColor}?text=${encodeURIComponent(
          artikel.judul
        )}&font=Inter`;

  return {
    id: artikel.news_id.toString(),
    title: artikel.judul,
    excerpt: artikel.abstrak,
    category: artikel.kategori,
    author: artikel.nama_penulis,
    date: originalDate,
    displayDate: originalDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    link: `/varia-statistik/artikel/${artikel.news_id}`,
    imageUrl: imageUrl,
    authorImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      artikel.nama_penulis
    )}&background=random&size=32&color=fff&font-size=0.45`,
    views: Math.floor(Math.random() * 250) + 20,
    comments: Math.floor(Math.random() * 30) + 5,
    ...styles,
  };
};

const slugToCategoryName = (slug: string): string => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function KategoriPage() {
  const router = useRouter();
  const { kategori: kategoriSlug } = router.query;

  const [displayedArticles, setDisplayedArticles] = useState<NewsCardItem[]>(
    []
  );
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    keyword: "",
    kategori: "",
    penulis: "",
    urutkan: "terbaru",
    tanggalMulai: null,
    tanggalSelesai: null,
  });

  const categoryName = useMemo(
    () => slugToCategoryName(kategoriSlug as string),
    [kategoriSlug]
  );

  // Ambil daftar penulis & kategori sekali saja untuk dropdown
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch("/api/berita/meta");
        if (!response.ok) throw new Error("Gagal mengambil data meta");
        const { authors, categories } = await response.json();
        setAllAuthors(authors);
        setAllCategories(categories);
      } catch (error) {
        console.error("Gagal mengambil data untuk filter:", error);
      }
    };
    fetchDropdownData();
  }, []);

  // Fungsi utama untuk mengambil data yang sudah terfilter dari API
  const runSearch = useCallback(async (filters: FilterValues) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filters.keyword) params.append("search", filters.keyword);
    if (filters.kategori) params.append("kategori", filters.kategori);
    if (filters.penulis) params.append("penulis", filters.penulis);
    if (filters.urutkan) params.append("urutkan", filters.urutkan);
    if (filters.tanggalMulai)
      params.append("tanggalMulai", filters.tanggalMulai.toISOString());
    if (filters.tanggalSelesai)
      params.append("tanggalSelesai", filters.tanggalSelesai.toISOString());

    try {
      const response = await fetch(`/api/berita?${params.toString()}`);
      if (!response.ok) throw new Error("Gagal melakukan pencarian");
      const data: ArtikelBerita[] = await response.json();
      setDisplayedArticles(data.map(mapArtikelToNewsCardItem));
    } catch (error) {
      console.error("Gagal mencari berita:", error);
      setDisplayedArticles([]);
    }
    setIsLoading(false);
  }, []);

  // Atur filter awal berdasarkan URL saat halaman dimuat
  useEffect(() => {
    if (router.isReady && kategoriSlug) {
      const newFilters: FilterValues = {
        ...activeFilters,
        kategori: categoryName,
      };
      setActiveFilters(newFilters);
      runSearch(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, kategoriSlug, categoryName]);

  // Handler saat filter di sidebar diubah
  const handleFilterChange = (newFilters: FilterValues) => {
    setActiveFilters(newFilters);
    runSearch(newFilters);
  };

  // Handler saat filter direset
  const handleReset = () => {
    const initialFilters: FilterValues = {
      keyword: "",
      kategori: "",
      penulis: "",
      urutkan: "terbaru",
      tanggalMulai: null,
      tanggalSelesai: null,
    };
    setActiveFilters(initialFilters);
    router.push("/varia-statistik");
  };

  return (
    <div className="bg-surface-page flex flex-col min-h-screen">
      {/* Header sederhana khusus untuk halaman ini */}
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4 text-center">
          <PageTitle
            title={`Kategori: ${categoryName}`}
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <main className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          <Link href="/varia-statistik" legacyBehavior>
            <a className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover font-semibold transition-colors">
              <ArrowLeft size={20} />
              Kembali ke Varia Statistik
            </a>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            initialKeyword={activeFilters.keyword}
            categories={allCategories}
            authors={allAuthors}
            initialCategory={activeFilters.kategori}
          />
          <ResultsGrid
            articles={displayedArticles}
            isLoading={isLoading}
            keyword={activeFilters.keyword}
            category={activeFilters.kategori}
          />
        </div>
      </main>
    </div>
  );
}
