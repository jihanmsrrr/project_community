// app/ruangbaca/page.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LoaderCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Code,
  Megaphone,
  FileText,
  Users,
  BarChart,
  Eye,
  FolderKanban,
  Briefcase,
  Gavel,
  Scale,
  Book,
} from "lucide-react";

import PageTitle from "@/components/ui/PageTitle";
import MateriCard from "@/components/Baca/MateriCard";
import SearchComponent, {
  SearchParams,
} from "@/components/Baca/SearchComponent";
import Breadcrumb, { Crumb } from "@/components/Baca/Breadcrumb"; // Impor Breadcrumb dan tipenya

interface ApiMaterial {
  material_id: string;
  uploader_id: string | null;
  judul: string | null;
  kategori: string | null;
  sub_kategori: string | null;
  deskripsi: string | null;
  file_path: string | null;
  tanggal_upload: string | null;
  hits: number;
  uploader?: { nama_lengkap: string | null } | null;
}

const kategoriDisplayMap: {
  [key: string]: { icon: React.ElementType; colorClass: string };
} = {
  "Asistensi Teknis": {
    icon: Code,
    colorClass: "bg-gradient-to-br from-sky-500 to-indigo-600",
  },
  "Reformasi Birokrasi": {
    icon: Briefcase,
    colorClass: "bg-gradient-to-br from-blue-500 to-violet-600",
  },
  "Leadership & Manajemen": {
    icon: Users,
    colorClass: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
  },
  "Akuntabilitas Kinerja": {
    icon: CheckCircle,
    colorClass: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  "Pembinaan Statistik": {
    icon: FolderKanban,
    colorClass: "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
  "Metodologi Sensus & Survei": {
    icon: BarChart,
    colorClass: "bg-gradient-to-br from-lime-500 to-emerald-600",
  },
  "Diseminasi Statistik": {
    icon: Megaphone,
    colorClass: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  "Seminar & Workshop": {
    icon: Book,
    colorClass: "bg-gradient-to-br from-orange-500 to-rose-500",
  },
  "Monitoring & Evaluasi": {
    icon: Eye,
    colorClass: "bg-gradient-to-br from-yellow-400 to-amber-500",
  },
  "Dokumentasi Paparan": {
    icon: FileText,
    colorClass: "bg-gradient-to-br from-slate-500 to-gray-600",
  },
  Regulasi: {
    icon: Gavel,
    colorClass: "bg-gradient-to-br from-gray-600 to-slate-800",
  },
  "Standar Biaya": {
    icon: Scale,
    colorClass: "bg-gradient-to-br from-stone-500 to-neutral-600",
  },
  default: {
    icon: BookOpen,
    colorClass: "bg-gradient-to-br from-gray-400 to-gray-500",
  },
};

export default function RuangBacaPage() {
  const [masterList, setMasterList] = useState<ApiMaterial[]>([]);
  const [displayedMaterials, setDisplayedMaterials] = useState<ApiMaterial[]>(
    []
  );
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    kategori: "",
    subKategori: "",
    urutkan: "hits",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingInitialData(true);
      try {
        const response = await fetch("/api/ruangbaca/materials");
        if (!response.ok) throw new Error("Gagal mengambil data awal");
        const data: ApiMaterial[] = await response.json();
        setMasterList(data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setIsLoadingInitialData(false);
      }
    };
    fetchInitialData();
  }, []);

  const runSearch = useCallback(async (paramsToSearch: SearchParams) => {
    if (!paramsToSearch.keyword && !paramsToSearch.kategori) return;
    setIsSearching(true);
    try {
      const query = new URLSearchParams();
      if (paramsToSearch.keyword)
        query.append("search", paramsToSearch.keyword);
      if (paramsToSearch.kategori)
        query.append("kategori", paramsToSearch.kategori);
      if (paramsToSearch.subKategori)
        query.append("sub_kategori", paramsToSearch.subKategori);

      const response = await fetch(
        `/api/ruangbaca/materials?${query.toString()}`
      );
      if (!response.ok) throw new Error("Gagal mengambil data terfilter");
      const data: ApiMaterial[] = await response.json();

      data.sort((a, b) => {
        if (paramsToSearch.urutkan === "judul")
          return (a.judul || "").localeCompare(b.judul || "");
        return b.hits - a.hits;
      });
      setDisplayedMaterials(data);
    } catch (err) {
      console.error("Error fetching filtered materials:", err);
      setHasError(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchTrigger = () => {
    if (!isSearchActive) setIsSearchActive(true);
    runSearch(searchParams);
  };

  const handleResetAndExitSearch = () => {
    setIsSearchActive(false);
    const initialParams = {
      keyword: "",
      kategori: "",
      subKategori: "",
      urutkan: "hits" as "hits" | "judul",
    };
    setSearchParams(initialParams);
    setDisplayedMaterials([]);
  };

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    masterList.forEach((m) => {
      if (m.kategori) categories.add(m.kategori);
    });
    return Array.from(categories).sort();
  }, [masterList]);

  const availableSubCategories = useMemo(() => {
    if (!searchParams.kategori) return [];
    const subCategories = new Set<string>();
    masterList.forEach((m) => {
      if (m.kategori === searchParams.kategori && m.sub_kategori) {
        subCategories.add(m.sub_kategori);
      }
    });
    return Array.from(subCategories).sort();
  }, [searchParams.kategori, masterList]);

  // --- PERBAIKAN: Fungsi untuk membuat data breadcrumb secara dinamis ---
  const generateBreadcrumbs = (): Crumb[] => {
    const crumbs: Crumb[] = [{ label: "Ruang Baca", href: "/ruangbaca" }];
    if (searchParams.keyword) {
      crumbs.push({
        label: `Hasil untuk "${searchParams.keyword}"`,
        href: "#",
        isCurrent: true,
      });
    } else if (searchParams.kategori) {
      crumbs.push({
        label: searchParams.kategori,
        href: `/ruangbaca/kategori/${searchParams.kategori}`,
        isCurrent: !searchParams.subKategori,
      });
      if (searchParams.subKategori) {
        crumbs.push({
          label: searchParams.subKategori,
          href: "#",
          isCurrent: true,
        });
      }
    }
    return crumbs;
  };

  const renderInitialView = () => (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-center">
        Direktori Materi Berdasarkan Kategori
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {availableCategories.map((kategori) => {
          const categoryInfo =
            kategoriDisplayMap[kategori] || kategoriDisplayMap["default"];
          const IconComponent = categoryInfo.icon;
          return (
            <Link
              href={`/ruangbaca/kategori/${encodeURIComponent(kategori)}`}
              key={kategori}
              className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${categoryInfo.colorClass}`}
            >
              <IconComponent size={48} className="mb-4 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-center drop-shadow-lg">
                {kategori}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <>
      {isSearching ? (
        <div className="text-center py-10">
          <LoaderCircle className="mx-auto h-12 w-12 text-brand-primary animate-spin" />
        </div>
      ) : hasError ? (
        <div className="text-center py-10 bg-red-50 text-red-700 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-xl font-semibold">Gagal Memuat Data</h3>
        </div>
      ) : displayedMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMaterials.map((modulItem) => (
            <MateriCard
              key={modulItem.material_id}
              modul={{
                ...modulItem,
                tanggal_upload: modulItem.tanggal_upload
                  ? new Date(modulItem.tanggal_upload)
                  : null,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <AlertTriangle size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold">Tidak Ada Hasil</h3>
          <p className="mt-1 text-gray-500">
            Coba sesuaikan filter atau kata kunci Anda.
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="bg-surface-page min-h-screen flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title="Ruang Baca BPS Community"
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
      </div>

      <main className="w-full mx-auto py-8 md:py-10 flex-grow">
        <AnimatePresence mode="wait">
          {!isSearchActive ? (
            <motion.div
              key="initial-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="mb-12">
                <SearchComponent
                  params={searchParams}
                  onParamsChange={setSearchParams}
                  onSearch={handleSearchTrigger}
                  availableKategori={availableCategories}
                  availableSubKategori={availableSubCategories}
                  isLoading={isLoadingInitialData}
                />
              </section>
              <div className="px-4 sm:px-6 lg:px-8">
                {isLoadingInitialData ? (
                  <div className="text-center py-10">
                    <LoaderCircle className="mx-auto h-8 w-8 text-brand-primary animate-spin" />
                  </div>
                ) : (
                  renderInitialView()
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="search-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              <div className="md:col-span-4 lg:col-span-3">
                <SearchComponent
                  isSidebar={true}
                  params={searchParams}
                  onParamsChange={setSearchParams}
                  onSearch={() => runSearch(searchParams)}
                  onReset={handleResetAndExitSearch}
                  availableKategori={availableCategories}
                  availableSubKategori={availableSubCategories}
                  isLoading={isSearching}
                />
              </div>
              <div className="md:col-span-8 lg:col-span-9">
                {/* --- PERBAIKAN: Menggunakan Breadcrumb dinamis --- */}
                <Breadcrumb crumbs={generateBreadcrumbs()} />
                {renderSearchResults()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
