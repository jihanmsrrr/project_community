// pages/varia-statistik/index.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation"; // FIX 4: Dihapus karena tidak digunakan

import type { ArtikelBerita, NewsCardItem } from "@/types/varia";
import NewsCardNoImage from "@/components/Berita/Card/NewsCardNoImage";
import { useRouter } from "next/router"; // Pastikan diimpor
import Skeleton from "@/components/ui/Skeleton";
import SectionWrapper from "@/components/ui/SectionWrapper";
import HeroDisplay from "@/components/Berita/Utama/HeroDisplay";
import CardGridDisplay from "@/components/Berita/Utama/CardGridDisplay";
import NewsCard from "@/components/Berita/Card/NewsCard";
import BeritaDaerahMainCard from "@/components/Berita/Card/BeritaDaerahMainCard";
import PilihanRedaksiListItem from "@/components/Berita/Card/PilihanRedaksiListItem";
import FotogenikMainCard from "@/components/Berita/Card/FotogenikMainCard";
import VariaStatistikPageHeader from "@/components/Berita/Utama/VariaStatistikPageHeader";
import FilterSidebar, {
  FilterValues,
} from "@/components/Berita/TampilBerita/FilterSidebar";
import ResultsGrid from "@/components/Berita/TampilBerita/ResultsGrid";

// === FUNGSI UTILITAS (TIDAK ADA PERUBAHAN) ===
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
  // ... (sisa fungsi getCategoryColorClasses tidak berubah) ...
  return {
    categoryColor: "text-indigo-600 dark:text-indigo-400",
    categoryBgColor: "bg-indigo-500",
    categoryHoverColor: "hover:text-indigo-700",
    placeholderTextColor: "text-white",
  };
};

// FIX 1: Pastikan tipe NewsCardItem di `types/varia.ts` sudah diubah agar `date` bertipe `Date`
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
    date: originalDate, // Ini sekarang valid karena tipe di NewsCardItem adalah Date
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

export default function VariaStatistikPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [allArticles, setAllArticles] = useState<NewsCardItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    keyword: "",
    kategori: "",
    penulis: "",
    urutkan: "terbaru",
    tanggalMulai: null,
    tanggalSelesai: null,
  });
  useEffect(() => {
    // Cek jika ada 'keyword' di URL
    if (router.isReady && router.query.keyword) {
      const keywordFromUrl = router.query.keyword as string;
      // Jalankan fungsi pencarian awal Anda dengan keyword dari URL
      handleInitialSearch(keywordFromUrl);
    }
  }, [router.isReady, router.query.keyword]);

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

  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set(allArticles.map((a) => a.category));
    return Array.from(categoriesSet);
  }, [allArticles]);

  // FIX 2: Tambahkan `uniqueAuthors` untuk diberikan sebagai prop
  const uniqueAuthors = useMemo(() => {
    const authorsSet = new Set(allArticles.map((a) => a.author));
    return Array.from(authorsSet);
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    let results = [...allArticles];
    const {
      keyword,
      kategori,
      penulis,
      urutkan,
      tanggalMulai,
      tanggalSelesai,
    } = activeFilters;

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerKeyword) ||
          a.excerpt.toLowerCase().includes(lowerKeyword)
      );
    }
    if (kategori) {
      results = results.filter((a) => a.category === kategori);
    }

    if (penulis) {
      results = results.filter((a) => a.author === penulis);
    }

    if (tanggalMulai && tanggalSelesai) {
      const startTime = new Date(tanggalMulai).setHours(0, 0, 0, 0);
      const endTime = new Date(tanggalSelesai).setHours(23, 59, 59, 999);
      results = results.filter((a) => {
        const articleTime = a.date.getTime(); // FIX 1: Ini sekarang valid
        return articleTime >= startTime && articleTime <= endTime;
      });
    }

    results.sort((a, b) => {
      if (urutkan === "judul") return a.title.localeCompare(b.title);
      return b.date.getTime() - a.date.getTime(); // FIX 1: Ini sekarang valid
    });

    return results;
  }, [allArticles, activeFilters]);

  const etalaseData = useMemo(() => {
    if (isSearching) return null;

    // FIX 1: Logika sorting ini juga sekarang valid
    const sortedByDate = [...allArticles].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    const hero =
      sortedByDate.find((a) =>
        a.category.toLowerCase().includes("bps terkini")
      ) || (sortedByDate.length > 0 ? sortedByDate[0] : null);

    const pilihanRedaksi = sortedByDate
      // Change: Filter removed. Now it will just take the latest articles,
      // potentially excluding the hero article to avoid duplication if it's among the latest.
      .filter((a) => a.id !== hero?.id) // Exclude hero if it's among the latest to avoid duplication
      .slice(0, 6);

    const beritaDaerah = sortedByDate.filter((a) =>
      a.category.toLowerCase().includes("berita daerah")
    );
    const bdMain = beritaDaerah.length > 0 ? beritaDaerah[0] : null;
    const bdList = beritaDaerah.slice(1, 3);

    const fotogenik = sortedByDate
      .filter((a) => a.category.toLowerCase().includes("fotogenik"))
      .slice(0, 3);

    const serbaSerbi = sortedByDate
      .filter((a) => a.category.toLowerCase().includes("serba serbi"))
      .slice(0, 3);

    const wisata = sortedByDate
      .filter((a) => a.category.toLowerCase().includes("wisata"))
      .slice(0, 4);

    const opini = sortedByDate
      .filter((a) => a.category.toLowerCase().includes("opini"))
      .slice(0, 2);

    return {
      beritaTerkiniHeroData: hero,
      pilihanRedaksiItemsData: pilihanRedaksi,
      beritaDaerahMainData: bdMain,
      beritaDaerahListData: bdList,
      fotogenikItemsData: fotogenik,
      serbaSerbiItemsData: serbaSerbi,
      wisataItemsData: wisata,
      opiniItemsData: opini,
    };
  }, [allArticles, isSearching]);

  const handleInitialSearch = (query: string) => {
    setActiveFilters({
      keyword: query,
      kategori: "",
      penulis: "",
      urutkan: "terbaru",
      tanggalMulai: null,
      tanggalSelesai: null,
    });
    setIsSearching(true);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setActiveFilters(newFilters);
    if (!isSearching) {
      setIsSearching(true);
    }
  };

  const resetSearch = () => {
    setActiveFilters({
      keyword: "",
      kategori: "",
      penulis: "",
      urutkan: "terbaru",
      tanggalMulai: null,
      tanggalSelesai: null,
    });
    setIsSearching(false);
  };
  return (
    <div className="bg-surface-page flex flex-col min-h-screen">
      <VariaStatistikPageHeader
        onSearch={handleInitialSearch}
        hideSearchBar={isSearching}
      />

      <main className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              onReset={resetSearch}
              initialKeyword={activeFilters.keyword}
              categories={uniqueCategories}
              authors={uniqueAuthors} // FIX 2: Tambahkan prop `authors` yang hilang
            />
            <ResultsGrid
              articles={filteredArticles}
              isLoading={isLoading}
              keyword={activeFilters.keyword}
            />
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            <SectionWrapper id="bps-terkini" className="!pt-0 !pb-0">
              <HeroDisplay
                // FIX 3: Tambahkan `?? null` untuk menghindari `undefined`
                newsItem={etalaseData?.beritaTerkiniHeroData ?? null}
                loading={isLoading}
              />
            </SectionWrapper>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="lg:col-span-8">
                <SectionWrapper id="berita-daerah">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Berita Daerah
                  </h2>
                  {isLoading && !etalaseData?.beritaDaerahMainData ? (
                    <Skeleton height="h-80" radius="rounded-xl" />
                  ) : (
                    <BeritaDaerahMainCard
                      // FIX 3: Tambahkan `?? null` untuk menghindari `undefined`
                      newsItem={etalaseData?.beritaDaerahMainData ?? null}
                    />
                  )}
                  {etalaseData?.beritaDaerahListData &&
                    etalaseData.beritaDaerahListData.length > 0 && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {etalaseData.beritaDaerahListData.map((item) => (
                          <NewsCardNoImage key={item.id} newsItem={item} />
                        ))}
                      </div>
                    )}
                </SectionWrapper>
              </div>
              <aside className="lg:col-span-4 sticky top-24">
                <SectionWrapper id="pilihan-redaksi">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Berita Terbaru
                  </h2>
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} height="h-16" />
                      ))}
                    </div>
                  ) : etalaseData?.pilihanRedaksiItemsData &&
                    etalaseData.pilihanRedaksiItemsData.length > 0 ? (
                    <ul className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 space-y-2 border-l-4 border-blue-500 dark:border-blue-400">
                      {etalaseData.pilihanRedaksiItemsData.map(
                        (item, index) => (
                          <PilihanRedaksiListItem
                            key={item.id}
                            item={item}
                            isNewest={index === 0} // Pass isNewest prop for the first item
                          />
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="italic text-gray-500">
                      Belum ada pilihan redaksi.
                    </p>
                  )}
                </SectionWrapper>
              </aside>
            </div>

            <SectionWrapper id="fotogenik">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Fotogenik
              </h2>
              <CardGridDisplay
                loading={isLoading}
                items={etalaseData?.fotogenikItemsData || []}
                CardComponent={FotogenikMainCard}
                gridClasses="sm:grid-cols-2 lg:grid-cols-3"
                skeletonHeight="h-80"
              />
            </SectionWrapper>

            <SectionWrapper id="serba-serbi">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Serba Serbi
              </h2>
              <CardGridDisplay
                loading={isLoading}
                items={etalaseData?.serbaSerbiItemsData || []}
                CardComponent={NewsCard}
              />
            </SectionWrapper>

            <SectionWrapper id="wisata">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Wisata Statistik
              </h2>
              <CardGridDisplay
                loading={isLoading}
                items={etalaseData?.wisataItemsData || []}
                CardComponent={NewsCard}
                gridClasses="sm:grid-cols-2 md:grid-cols-4"
                skeletonCount={4}
              />
            </SectionWrapper>

            <SectionWrapper id="opini" className="pb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Opini
              </h2>
              <CardGridDisplay
                loading={isLoading}
                items={etalaseData?.opiniItemsData || []}
                CardComponent={NewsCard}
                gridClasses="sm:grid-cols-2"
                skeletonCount={2}
              />
            </SectionWrapper>
          </div>
        )}
      </main>
    </div>
  );
}
