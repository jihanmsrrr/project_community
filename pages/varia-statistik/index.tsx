// pages/varia-statistik/index.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import type { ArtikelBerita, NewsCardItem } from "@/types/varia";
import FilterSidebar, {
  FilterValues,
} from "@/components/Berita/TampilBerita/FilterSidebar";
import ResultsGrid from "@/components/Berita/TampilBerita/ResultsGrid";
import HeroDisplay from "@/components/Berita/Utama/HeroDisplay";
import BeritaDaerahMainCard from "@/components/Berita/Card/BeritaDaerahMainCard";
import NewsCardNoImage from "@/components/Berita/Card/NewsCardNoImage";
import PilihanRedaksiListItem from "@/components/Berita/Card/PilihanRedaksiListItem";
import CardGridDisplay from "@/components/Berita/Utama/CardGridDisplay";
import FotogenikMainCard from "@/components/Berita/Card/FotogenikMainCard";
import NewsCard from "@/components/Berita/Card/NewsCard";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Skeleton from "@/components/ui/Skeleton";
import { LoaderCircle } from "lucide-react";
import { getVariaStatistikLayout } from "@/components/Berita/Utama/VariaStatistikLayout";

// --- FUNGSI UTILITAS ---
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

const VariaStatistikPage = () => {
  const router = useRouter();
  const [etalaseArticles, setEtalaseArticles] = useState<NewsCardItem[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<NewsCardItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    keyword: "",
    kategori: "",
    penulis: "",
    urutkan: "terbaru",
    tanggalMulai: null,
    tanggalSelesai: null,
  });

  // --- PERBAIKAN: State terpisah untuk data menu ---
  const [menuCategories, setMenuCategories] = useState<string[]>([]);
  const [dropdownAuthors, setDropdownAuthors] = useState<string[]>([]);

  // --- PERBAIKAN: useEffect untuk mengambil data menu dan dropdown filter ---
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await fetch("/api/meta");
        if (!response.ok) throw new Error("Gagal mengambil data meta");
        const data = await response.json();
        if (data.categories) setMenuCategories(data.categories);
        if (data.authors) setDropdownAuthors(data.authors);
      } catch (error) {
        console.error("Gagal memuat data meta:", error);
      }
    };
    fetchMetaData();
  }, []);

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
      const data: ArtikelBerita[] = await response.json();
      setDisplayedArticles(data.map(mapArtikelToNewsCardItem));
    } catch (error) {
      console.error("Gagal mencari berita:", error);
      setDisplayedArticles([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const keywordFromUrl = router.query.keyword as string | undefined;
    if (keywordFromUrl) {
      setIsSearching(true);
      const newFilters: FilterValues = {
        keyword: keywordFromUrl,
        kategori: "",
        penulis: "",
        urutkan: "terbaru",
        tanggalMulai: null,
        tanggalSelesai: null,
      };
      setActiveFilters(newFilters);
      runSearch(newFilters);
    } else {
      setIsSearching(false);
      const fetchInitialArticles = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/berita");
          const data: ArtikelBerita[] = await response.json();
          setEtalaseArticles(data.map(mapArtikelToNewsCardItem));
        } catch (error) {
          console.error("Gagal mengambil data awal berita:", error);
        }
        setIsLoading(false);
      };
      fetchInitialArticles();
    }
  }, [router.isReady, router.query.keyword, runSearch]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setActiveFilters(newFilters);
    setIsSearching(true);
    runSearch(newFilters);
  };

  const resetSearch = () => {
    router.push("/varia-statistik", undefined, { shallow: true });
  };

  const { etalaseData } = useMemo(() => {
    const hero =
      etalaseArticles.find((a) =>
        a.category.toLowerCase().includes("bps terkini")
      ) || (etalaseArticles.length > 0 ? etalaseArticles[0] : null);
    const pilihanRedaksi = etalaseArticles
      .filter((a) => a.id !== hero?.id)
      .slice(0, 6);
    const beritaDaerah = etalaseArticles.filter((a) =>
      a.category.toLowerCase().includes("berita daerah")
    );
    const bdMain = beritaDaerah.length > 0 ? beritaDaerah[0] : null;
    const bdList = beritaDaerah.slice(1, 3);
    const fotogenik = etalaseArticles
      .filter((a) => a.category.toLowerCase().includes("fotogenik"))
      .slice(0, 3);
    const serbaSerbi = etalaseArticles
      .filter((a) => a.category.toLowerCase().includes("serba serbi"))
      .slice(0, 3);
    const wisata = etalaseArticles
      .filter((a) => a.category.toLowerCase().includes("wisata"))
      .slice(0, 4);
    const opini = etalaseArticles
      .filter((a) => a.category.toLowerCase().includes("opini"))
      .slice(0, 2);
    return {
      etalaseData: {
        beritaTerkiniHeroData: hero,
        pilihanRedaksiItemsData: pilihanRedaksi,
        beritaDaerahMainData: bdMain,
        beritaDaerahListData: bdList,
        fotogenikItemsData: fotogenik,
        serbaSerbiItemsData: serbaSerbi,
        wisataItemsData: wisata,
        opiniItemsData: opini,
      },
    };
  }, [etalaseArticles]);

  if (!router.isReady || (isLoading && !isSearching)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-page">
        <LoaderCircle className="w-12 h-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  return isSearching ? (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <FilterSidebar
        onFilterChange={handleFilterChange}
        onReset={resetSearch}
        initialKeyword={activeFilters.keyword}
        categories={menuCategories}
        authors={dropdownAuthors}
      />
      <ResultsGrid
        articles={displayedArticles}
        isLoading={isLoading}
        keyword={activeFilters.keyword}
      />
    </div>
  ) : (
    <div className="space-y-12 md:space-y-16">
      <SectionWrapper id="bps-terkini" className="!pt-0 !pb-0">
        <HeroDisplay
          newsItem={etalaseData.beritaTerkiniHeroData ?? null}
          loading={isLoading}
        />
      </SectionWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-8">
          <SectionWrapper id="berita-daerah">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Berita Daerah
            </h2>
            {isLoading && !etalaseData.beritaDaerahMainData ? (
              <Skeleton height="h-80" radius="rounded-xl" />
            ) : (
              <BeritaDaerahMainCard
                newsItem={etalaseData.beritaDaerahMainData ?? null}
              />
            )}
            {etalaseData.beritaDaerahListData &&
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
            ) : etalaseData.pilihanRedaksiItemsData &&
              etalaseData.pilihanRedaksiItemsData.length > 0 ? (
              <ul className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 space-y-2 border-l-4 border-blue-500 dark:border-blue-400">
                {etalaseData.pilihanRedaksiItemsData.map((item, index) => (
                  <PilihanRedaksiListItem
                    key={item.id}
                    item={item}
                    isNewest={index === 0}
                  />
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500">Belum ada pilihan redaksi.</p>
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
          items={etalaseData.fotogenikItemsData || []}
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
          items={etalaseData.serbaSerbiItemsData || []}
          CardComponent={NewsCard}
        />
      </SectionWrapper>
      <SectionWrapper id="wisata">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Wisata Statistik
        </h2>
        <CardGridDisplay
          loading={isLoading}
          items={etalaseData.wisataItemsData || []}
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
          items={etalaseData.opiniItemsData || []}
          CardComponent={NewsCard}
          gridClasses="sm:grid-cols-2"
          skeletonCount={2}
        />
      </SectionWrapper>
    </div>
  );
};

VariaStatistikPage.getLayout = getVariaStatistikLayout;

export default VariaStatistikPage;
